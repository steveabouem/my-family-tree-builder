import dayjs from "dayjs";
import { Op } from "sequelize";
import FamilyMember from "../../models/FamilyMember";
import FamilyTree from "../../models/FamilyTree";
import { APIFamilyMemberArrayKeys, APIFamilyMemberDAO } from "../../controllers/familyMember/familyMember.definitions";
import logger from "../../utils/logger";

export class FamilyMemberService {
  private anchorKey: string = 'anchor';

   /*
    * Using this function for both bulk and single operation
    * Receives an array of family members, within which each member has a list of children, siblings and spouses
    * loops through the arrays and creates a familyMember record for each member,
    * for the next member, check if the member already exists in the DB, if not create it
    * create the tree
    * as all the family members are created, crete a mirror obect if the incoming DAO, but this time with the DB ids.
    * return the resulting DAO
  */
  async createRecords(members: { [stepName: string]: APIFamilyMemberDAO }, userId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
    const anchor = members?.[this.anchorKey];

    try {
      if (anchor) {
        const duplicate = await FamilyMember.findOne({
          where: {
            [Op.and]: [{ first_name: anchor.first_name }, { last_name: anchor.last_name }, { dob: anchor.dob }]
          }
        });

        if (duplicate?.dataValues) {
          logger.error('Family member record appears to be a duplicate', { anchor, duplicate });
          return null;
        }

        return await this.getMembersFromCreateAction(anchor, userId);
      } else {
        logger.error('No record created, missing anchor node. Returning empty array');
        return null;
      }
    } catch (e: unknown) {
      logger.error('Unable to bulk create members ', e);
      return null;
    }
  }
  /*
  * @request: {members: {[nodeId: string]: APIFamilyMemberDAO}, userId: number, treeId?: number}
  * Receives an array of family members from the same, existing tree
  * Update their individual records in db
  * Update the tree's members value
  * Returns updated tree and members
  */
  public async updateRecordAndRelations(members: { [nodeId: string]: APIFamilyMemberDAO }, userId: number, treeId?: number): Promise<{ [key: string]: APIFamilyMemberDAO } | null> {
    // TODO: inactive trees should not allow this operation
    /*
    * The anchor is the initial step of the family tree step form,
    * on which all the relations are based
    */
    const data = members?.anchor;

    if (data) {
      const payload = await this.getMembersFromUpdateAction(data, treeId || 0);

      return payload;
    } else {
      logger.error('No anchor provided for update ', members);
    }

    return null;
  }

  async getMemberByNodeId(nodeId: string): Promise<FamilyMember | null> {
    try {
      return await FamilyMember.findOne({ where: { node_id: { [Op.eq]: nodeId } } });
    } catch (e: unknown) {
      logger.error('Failed to get member by node id:', e);
      return null;
    }
  }

  async updateMember(id: number, updateData: any): Promise<FamilyMember | null> {
    try {
      const member = await FamilyMember.findByPk(id);
      if (!member) return null;

      await member.update(updateData);
      return member;
    } catch (e: unknown) {
      logger.error('Failed to update member:', e);
      return null;
    }
  }

  async deleteMember(id: number): Promise<boolean> {
    try {
      const member = await FamilyMember.findByPk(id);
      if (!member) return false;

      await member.destroy();
      return true;
    } catch (e: unknown) {
      logger.error('Failed to delete member:', e);
      return false;
    }
  }


  /*
  * @data: the info of the member to create
  * @userId
  * returns a hashmap of the records keyed to their ids, for all members and their respective  connections
  */
  private async getMembersFromCreateAction(data: APIFamilyMemberDAO, userId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
    const today = dayjs();
    const children = data?.children || [];
    const siblings = data?.siblings || [];
    const spouses = data?.spouses || [];
    const parents = data?.parents || [];
    logger.info('Received info to generate record ', data);
    data.age = today.diff(dayjs(data.dob), 'years');
    children?.forEach((c: any) => {
      c.age = today.diff(dayjs(c.dob), 'years');
      c.parents = JSON.stringify([...c?.parents || [], data]);
    });
    siblings?.forEach((s: any) => {
      s.siblings = JSON.stringify([...s.siblings || [], data]);
      s.age = today.diff(dayjs(s.dob), 'years');
    });
    parents?.forEach((p: any) => {
      p.age = today.diff(dayjs(p.dob), 'years');
      p.children = JSON.stringify([...p?.children || [], data]);
    });
    spouses?.forEach((s: any) => {
      s.age = today.diff(dayjs(s.dob), 'years');
      s.spouses = JSON.stringify([...s?.spouses || [], data]);
    });

    const payload: any = [data, ...children, ...siblings, ...parents, ...spouses];

    logger.info("Resulting flat array for members: ", { payload });
    /*
    * since we're using a step form, we don't have to worry about drilling through the array.
    * every member's info is at the first level of the array. The repetition is necessary for the ui library responsible for rendering the tree
    */
    const newMemberGroup: FamilyMember[] = [];
    // ? for of are usually best for async
    for (const m of payload) {
      const duplicateRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: m.node_id } } });

      if (!duplicateRecord?.dataValues) {
        const addedRecord = await FamilyMember.create({
          ...m,
          description: m?.description || '',
          user_id: m?.userId || 0,
          created_by: 1,
          parents: JSON.stringify(m.parents),
          spouses: JSON.stringify(m.spouses),
          siblings: JSON.stringify(m.siblings),
          children: JSON.stringify(m.children),
        })
          .catch((e: unknown) => {
            logger.error('Failed adding new record ', e);
          });

        if (addedRecord)
          newMemberGroup.push(addedRecord);
      }
    };

    if (!!newMemberGroup) {
      logger.info('All new members created: ', { newMemberGroup });
      const newMembersMap = newMemberGroup.reduce((map: { [nodeId: string]: FamilyMember }, currentMember: FamilyMember) => {
        return ({ ...map, [currentMember.id]: currentMember });
      }, {});
      return newMembersMap;
    } else {
      logger.error('Unable to bulk create members, no records created');
    }
    return null;
  }



  /*
  * @data: the info of the member to update
  * @treeId
  * Receives a familyMember DAO with additional data to update the record with (including a kinship array potentially)
  * returns a hashmap of the records keyed to their ids, for all members and their respective  connections
  */
  private async getMembersFromUpdateAction(data: APIFamilyMemberDAO, treeId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
    const matchingRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: data.node_id } } });
    const matchingTree = await FamilyTree.findByPk(treeId);
    const kinshipMapping: { relation: APIFamilyMemberArrayKeys, inverseRelation: APIFamilyMemberArrayKeys, }[] = [
      { relation: 'children', inverseRelation: 'parents' }, { relation: 'siblings', inverseRelation: 'siblings' },
      { relation: 'parents', inverseRelation: 'children' }, { relation: 'spouses', inverseRelation: 'spouses' }
    ];
    let updatedRecord: FamilyMember | void;

    if (matchingRecord?.dataValues && matchingTree?.dataValues) { // if no tree exists for this member, no execution should lead here
      let unsavedfamilyMembers: any = [];
      let payload: any = {};
      logger.info('Found matching family member: ', matchingRecord.dataValues);
      /*
      * Create records for any additional kin (children, siblings, parents, spouses), and update the incoming family member record accordingly
      */
      for (const { relation, inverseRelation } of kinshipMapping) {
        // ? Go through each type of relation
        const nodeIdsForKinshipType = (data?.[relation] || []).map((c: APIFamilyMemberDAO) => c.node_id) || [];

        if (data?.[relation]?.length) {
          // ? If the current relation type has a family member associtated to it, check for duplicates then create records for non duplicates
          const existingRecords = await FamilyMember.findAll({ where: { node_id: { [Op.in]: nodeIdsForKinshipType } } });
          const existingRecordsData = existingRecords.map((r: any) => r.dataValues);
          logger.info('List of existing records ', existingRecordsData);
          const nodeIdsForExistingRecords = existingRecordsData?.map((r: FamilyMember) => {
            return r.node_id
          });
          // ? non duplicates 
          const unsavedRecords = data?.[relation]?.filter((member: APIFamilyMemberDAO) => !nodeIdsForExistingRecords?.includes(member.node_id)) || [];
          unsavedfamilyMembers = [...unsavedfamilyMembers, ...unsavedRecords];
          logger.info('List of records to be added after check: ', { unsavedRecords, existingRecordsData });

          await Promise.all(
            // ? create records for non duplicates
            unsavedRecords.map(async (c: APIFamilyMemberDAO) => {
              // ? include current related member into the correct kinship array, then update the current record witht that info
              const savedRecord = await this.getMembersFromCreateAction({ ...c, [inverseRelation]: [data] }, data?.userId || 0);
              logger.info("saved record looks like this ", savedRecord);
              payload = { ...payload, ...savedRecord };
            })
          );

          // ? update the matching record and add the new memebers to the matching kinship array
          updatedRecord = await matchingRecord.update({
            [relation]: JSON.stringify([...unsavedRecords, ...existingRecordsData || []])
          });
          logger.info('Resulting list of new records: ', { unsavedRecords, updatedRecord });
          if (updatedRecord?.id) {
            // ? update matching tree's members array
            const treeMembers = matchingTree.dataValues.members;
            logger.info('Members in related tree before update ', treeMembers);
            const indexOfUpdatedRecord = treeMembers.findIndex((member: any) => {
              member.id == updatedRecord?.id || 0;
            });

            if (indexOfUpdatedRecord) {
              treeMembers.splice(indexOfUpdatedRecord, 1, updatedRecord);
              logger.info('Found the member in a given tree and updated the members array with the new info: ', treeMembers);
              await matchingTree.update({ members: treeMembers })
              // ? add the updated record to the mapping of family members in order to return it to the route handler
              treeMembers.forEach((member: any) => {
                logger.info('Does this have the actual record data? ', { member });
                payload[member.id] = member
              })
            }
          }
        }
      }
      logger.info('Final payload ', { ...payload });

      return payload;
    } else {
      logger.error('No record matches the member to update ', data);
    }

    return null;
  }

  /*
  * Position the family members in the tree
  */
  public positionFamilyMembers = (members: APIFamilyMemberDAO[]): APIFamilyMemberDAO[] => {
    const membersWithCoords: any = [];

    Object.values(members).forEach((currentMember: any, index: number) => {
      const position = { x: index * 125, y: 0 };
      const children = JSON.parse(currentMember?.children || '[]');
      const siblings = JSON.parse(currentMember?.siblings || '[]');
      const spouses = JSON.parse(currentMember?.spouses || '[]');
      const parents = JSON.parse(currentMember?.parents || '[]');
      logger.info("Collected all anchor's relatives", { children, parents, spouses, siblings, currentMember });
      /*
      * find all the node children,  position them below it, then update each child's node's position
      */
      if (Array.isArray(children)) {
        /*
        * if the child was already processed through another incoming node (family member), ignore it
        */
        children.forEach((child: any, childIndex: number) => {
          if (membersWithCoords.find((newNode: any) => newNode.node_id === child.node_id)) {
            logger.info('ignoring family member\'s current child as it is a dupe, ', { child });
          } else {
            membersWithCoords.push({
              ...child,
              type: 'custom',
              position: { x: position.x + (125 * (childIndex + 1)), y: position.y + 125 },
              name: '',
              data: {
                ...child,
                label: `${child.first_name} ${child.last_name}`,
                connections: [...child?.connections || [], { id: `${currentMember.node_id}-${child.node_id}`, source: currentMember.node_id, target: child.node_id }]
              }
            });
          }
        });
      }
      /*
      * find all the node siblings,  position them below it, then update each child's node's position
      */
      if (Array.isArray(siblings)) {
        /*
        * if the sibling was already processed through another incoming node (family member), ignore it
        */
        siblings.forEach((sibling: any, siblingIndex: number) => {
          if (membersWithCoords.find((newNode: any) => newNode.node_id === sibling.node_id)) {
            logger.info('ignoring family member\'s current sibling as it is a dupe, ', { sibling });
          } else {
            membersWithCoords.push({
              ...sibling,
              type: 'custom',
              position: { x: position.x + (325 * (siblingIndex + 1)), y: position.y },
              name: `${sibling.first_name} ${sibling.last_name}`,
              data: {
                ...sibling, label: `${sibling.first_name} ${sibling.last_name}`,
                connections: [...sibling?.connections || [], { id: `${currentMember.node_id}-${sibling.node_id}`, source: currentMember.node_id, target: sibling.node_id }]
              }
            });
          }
        });
      }
      /*
      * find all the node spouses,  position them below it, then update each child's node's position
      */
      if (Array.isArray(spouses)) {
        /*
        * if the child was already processed through another incoming node (family member), ignore it
        */
        spouses.forEach((spouse: any, spousIndex: number) => {
          if (membersWithCoords.find((newNode: any) => newNode.node_id === spouse.node_id)) {
            logger.info('ignoring family member\'s current spouse as it is a dupe, ', { spouse });
          } else {
            membersWithCoords.push({
              ...spouse,
              type: 'custom',
              position: { x: position.x + (325 * (spousIndex + 1)), y: position.y },
              name: '',
              data: {
                ...spouse,
                label: `${spouse.first_name} ${spouse.last_name}`,
                connections: [...spouse?.connections || [], { id: `${currentMember.node_id}-${spouse.node_id}`, source: currentMember.node_id, target: spouse.node_id }]
              }
            });
          }
        });
      }
      /*
      * find all the node parents,  position them above it, then update each parent's node's position
      */
      if (Array.isArray(parents)) {
        /*
        * if the parent was already processed through another incoming node (family member), ignore it
        */
        parents.forEach((parent: any, parentIndex: number) => {
          if (membersWithCoords.find((newNode: any) => newNode.node_id === parent.node_id)) {
            logger.info('ignoring family member\'s current spouse as it is a dupe, ', { parent });
          } else {
            const xOffset = parent.gender == 2 ? position.x + (225 * (parentIndex + 1)) : position.x - 125;
            membersWithCoords.push({
              ...parent,
              type: 'custom',
              position: { x: xOffset, y: position.y - 125 },
              name: '',
              data: {
                ...parent,
                label: `${parent.first_name} ${parent.last_name}`,
                connections: [...parent?.connections || [], { id: `${currentMember.node_id}-${parent.node_id}`, source: currentMember.node_id, target: parent.node_id }]
              }
            });
          }
        });
      }
      if (membersWithCoords.find((newNode: any) => newNode.node_id === currentMember.node_id)) {
        logger.info('ignoring family member as it is a dupe, ', { node: currentMember });
      } else {
        membersWithCoords.push({
          ...currentMember,
          type: 'custom',
          position,
          data: { label: `${currentMember.first_name} ${currentMember.last_name}`, ...currentMember }
        });
      }
    });

    logger.info('newNodeState', membersWithCoords);
    return membersWithCoords;
  }
} 