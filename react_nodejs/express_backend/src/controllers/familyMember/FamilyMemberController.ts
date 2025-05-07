import BaseController from "../Base.controller";
import { Request, Response } from "express";
import dayjs from "dayjs";
import { Op } from "sequelize";
import FamilyMember from "../../models/FamilyMember";
import { APIFamilyMemberArrayKeys, APIFamilyMemberDAO, APIFamilyMemberDTO } from "./familyMember.definitions";
import logger from "../../utils/logger";
import { APIFamilyTreeDAO } from "../familyTree/familyTree.definitions";

class FamilyMemberController extends BaseController<any> {
  anchorKey: string;
  constructor() {
    super('family_trees');
    this.anchorKey = 'anchor';
  }

  /*
  * Using this function for both bulk and single operation
  * Receives an array of family members, within which each member has a list of children, siblings and spouses
  * loops through the arrays and creates a familyMember record for each member,
  * for the next member, check if the member already exists in the DB, if not create it
  * create the tree
  * as all the family members are created, crete a mirror obect if the incoming DAO, but this time with the DB ids.
  * return the resulting DAO
  */
  public async createRecords(members: { [stepName: string]: APIFamilyMemberDAO }, userId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
    let res: any = [];
    const anchor = members?.[this.anchorKey];

    try {
      if (anchor) {
        const duplicate = await FamilyMember.findOne({
          where: {
            [Op.and]: [{ first_name: anchor.first_name }, { last_name: anchor.last_name }, { dob: anchor.dob }]
          }
        })
          .catch((e: unknown) => {
            logger.error('Error finding duplicate anchor ', e)
          });

        if (duplicate?.dataValues) {
          logger.error('Family member record appears to be a duplicate', { anchor, duplicate });
          return null;
        }

        const payload = this.getMembersFromCreateAction(anchor, userId);
        return payload;
      } else {
        logger.error('No record created, missing anchor node. Returning empty array', res);
        return null;
      }
    } catch (e: unknown) {
      logger.error('Unable to bulk create members ', e);
    }

    return res;
  }

  /*
  * @request: {data: APIFamilyMemberDTO[], treeId: number}
  * Receives an array of family members from the same, existing tree
  * Update their individual records in db
  * Update the tree's members value
  * Returns updated tree and members
  */
  public async updateRecordAndRelations(req: Request<{}, {}, APIFamilyTreeDAO, {}>, res: Response): Promise<{[key: string]: APIFamilyMemberDAO} | null> {
    // TODO: inactive trees should not allow this operation
    try {
      /*
      * The anchor is the initial step of the family tree step form,
      * on which all the relations are based
      */
      const data = req.body.members?.anchor;

      if (data) {
        const userId: number = req.body.userId;
        const payload = await this.getMembersFromUpdateAction({ ...data, tree_id: req.body.treeId }, userId);

        return payload;
      } else {
        logger.error('No anchor provided for update ', req.body);
      }
    } catch (e: unknown) {
      logger.error('Forwarding error to base controller ', e);
    }

    return null;
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
  * @userId
  * Receives a familyMember DAO with additional data to update the record with (including a kinship array potentially)
  * returns a hashmap of the records keyed to their ids, for all members and their respective  connections
  */
  private async getMembersFromUpdateAction(data: APIFamilyMemberDAO, userId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
    const matchingRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: data.node_id } } });
    const kinshipMapping: { relation: APIFamilyMemberArrayKeys, inverseRelation: APIFamilyMemberArrayKeys, }[] = [
      { relation: 'children', inverseRelation: 'parents' }, { relation: 'siblings', inverseRelation: 'siblings' },
      { relation: 'parents', inverseRelation: 'children' }, { relation: 'spouses', inverseRelation: 'spouses' }
    ];
    let updatedRecord: FamilyMember | void;

    if (matchingRecord?.dataValues) {
      let unsavedfamilyMembers: any = [];
      let payload: any = {};
      logger.info('Found matching family member: ', matchingRecord.dataValues);
      /*
      * Create records for any additional kin (children, siblings, parents, spouses)
      */
      for (const { relation, inverseRelation } of kinshipMapping) {
        // ? Go through each type of relation
        const nodeIdsForKinshipType = (data?.[relation] || []).map((c: APIFamilyMemberDAO) => c.node_id) || [];

        if (data?.[relation]?.length) {
          // ? If the current relation type has a family member associtated to it, check for duplicates then create records for non duplicates
          const existingRecords = await FamilyMember.findAll({ where: { node_id: { [Op.in]: nodeIdsForKinshipType } } });
          logger.info('List of existing records ', existingRecords);
          const nodeIdsForExistingRecords = existingRecords?.map((r: FamilyMember) => r.node_id);
          // ? non duplicates 
          const unsavedRecords = data[relation].filter((member: APIFamilyMemberDAO) => !nodeIdsForExistingRecords?.includes(member.node_id));
          unsavedfamilyMembers = [...unsavedfamilyMembers, ...unsavedRecords];
          logger.info('List of records to be added after check: ', { unsavedRecords, existingRecords });

          await Promise.all(
            // ? create records for non duplicates
            unsavedRecords.map(async (c: APIFamilyMemberDAO) => {
              try {
                // ? include current related member into the correct kinship array, then update the current record witht that info
                const savedRecord = await this.getMembersFromCreateAction({ ...c, [inverseRelation]: [data] }, userId);
                payload = { ...payload, ...savedRecord };
              } catch (error) {
                logger.error('Update for unsaved records failed ', error);
              }
            })
          );

          // ? update the matching record and add the new memebers to the matching kinship array
          updatedRecord = await matchingRecord.update({
            ...matchingRecord.dataValues,
            [relation]: JSON.stringify([...unsavedRecords, ...existingRecords || []])
          });
          logger.info('Resulting list of new records: ', { unsavedRecords, updatedRecord });
          if (updatedRecord?.id) {
            // ? add the updated record to the mapping of family members in order to return it to the route handler
            payload[updatedRecord.id] = updatedRecord;
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
  // public async delete(req: Request, res: Response) {
  //   const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
  //   const treeId = req.body.id;
  //   try {
  //     const currentTree = await FamilyTree.findByPk(treeId);
  //     if (currentTree) {

  //       await currentTree.destroy();
  //       response.status = 200;
  //       response.error = false;
  //       response.message = 'Family Tree Deleted Succesfully';
  //       res.status(200);
  //     } else {
  //       response.status = 400;
  //       response.error = true;
  //       response.message = 'Family Tree Does not Exist';
  //       res.status(400);
  //     }

  //   } catch (e: unknown) {
  //     response.status = 400;
  //     response.message = `Caught ERR ${e}`;
  //     res.status(400);
  //   }

  //   res.json(response);
  // }

}

export default FamilyMemberController;
