import dayjs from "dayjs";
import { Op } from "sequelize";
import FamilyTree from "../../models/FamilyTree";
import FamilyMember from "../../models/FamilyMember";
import User from "../../models/User";
import logger from "../../utils/logger";
import { APIFamilyTreeDAO, APIGetFamilyTreeResponse } from "../../controllers/familyTree/familyTree.definitions";
import { APIFamilyMemberArrayKeys, APIFamilyMemberDAO } from "../../controllers/familyMember/familyMember.definitions";
import { APIRequestPayload } from "../../controllers/controllers.definitions";
import { ServiceResponseWithPayload } from "../../services/service.definitions";

function convertToFamilyMembers(membersData: unknown): FamilyMember[] {
  if (!membersData) return [];
  const data = typeof membersData === 'string' ? JSON.parse(membersData) : membersData;
  return data.map((memberData: any) => {
    const member = new FamilyMember();
    Object.assign(member, memberData);
    return member;
  });
}

function convertToJSON(members: FamilyMember[]): any {
  return members.map(member => member.toJSON());
}

async function getAllTrees(userId?: string): Promise<ServiceResponseWithPayload<FamilyTree[]>> {
  let response: APIRequestPayload<FamilyTree[]> = { code: 500, error: true, payload: [] };
  let treeList: FamilyTree[] = [];
  try {
    if (userId) {
      treeList = await FamilyTree.findAll({
        where: {
          members: {
            [Op.like]: `%"user_id":${userId}%`
          }
        } as any
      });
      response.code = 200;
      response.error = false;
      response.message = 'Fetched tree successfully.'
    } else {
      response.message = 'Fetched tree error.'
      logger.error('Unable to fetch trees. No user Id');
      response.code = 400;
    }
  } catch (e: unknown) {
    response.code = 500;
    logger.error('Unable to fetch trees ', e);
  }
  response.payload = treeList;
  return response;
}

function positionFamilyMembers(members: APIFamilyMemberDAO[]): APIFamilyMemberDAO[] {
  const membersWithCoords: any = [];
  Object.values(members).forEach((currentMember: any, index: number) => {
    const position = { x: index * 125, y: 0 };
    const children = currentMember?.children || '[]';
    const siblings = currentMember?.siblings || '[]';
    const spouses = currentMember?.spouses || '[]';
    const parents = currentMember?.parents || '[]';
    logger.info("Collected all anchor's relatives", { children, parents, spouses, siblings, currentMember });
    if (Array.isArray(children)) {
      children.forEach((child: any, childIndex: number) => {
        if (!membersWithCoords.find((newNode: any) => newNode.node_id === child.node_id)) {
          membersWithCoords.push({
            ...child,
            type: 'custom',
            position: { x: position.x + (125 * (childIndex + 1)), y: position.y + 125 },
            name: '',
            data: {
              ...child,
              label: `${child.first_name} ${child.last_name}`,
              connections: [...child?.connections || [], {
                id: `${currentMember.node_id}-${child.node_id}`,
                source: currentMember.node_id,
                target: child.node_id
              }]
            }
          });
        } else {
          logger.info('ignoring family member\'s current child as it is a dupe, ', { child });
        }
      });
    }
    if (Array.isArray(siblings)) {
      siblings.forEach((sibling: any, siblingIndex: number) => {
        if (!membersWithCoords.find((newNode: any) => newNode.node_id === sibling.node_id)) {
          membersWithCoords.push({
            ...sibling,
            type: 'custom',
            position: { x: position.x + (325 * (siblingIndex + 1)), y: position.y },
            name: `${sibling.first_name} ${sibling.last_name}`,
            data: {
              ...sibling,
              label: `${sibling.first_name} ${sibling.last_name}`,
              connections: [...sibling?.connections || [], {
                id: `${currentMember.node_id}-${sibling.node_id}`,
                source: currentMember.node_id,
                target: sibling.node_id
              }]
            }
          });
        } else {
          logger.info('ignoring family member\'s current sibling as it is a dupe, ', { sibling });
        }
      });
    }
    if (Array.isArray(spouses)) {
      spouses.forEach((spouse: any, spousIndex: number) => {
        if (!membersWithCoords.find((newNode: any) => newNode.node_id === spouse.node_id)) {
          membersWithCoords.push({
            ...spouse,
            type: 'custom',
            position: { x: position.x + (325 * (spousIndex + 1)), y: position.y },
            name: '',
            data: {
              ...spouse,
              label: `${spouse.first_name} ${spouse.last_name}`,
              connections: [...spouse?.connections || [], {
                id: `${currentMember.node_id}-${spouse.node_id}`,
                source: currentMember.node_id,
                target: spouse.node_id
              }]
            }
          });
        } else {
          logger.info('ignoring family member\'s current spouse as it is a dupe, ', { spouse });
        }
      });
    }
    if (Array.isArray(parents)) {
      parents.forEach((parent: any, parentIndex: number) => {
        if (!membersWithCoords.find((newNode: any) => newNode.node_id === parent.node_id)) {
          const xOffset = parent.gender == 2 ? position.x + (225 * (parentIndex + 1)) : position.x - 125;
          membersWithCoords.push({
            ...parent,
            type: 'custom',
            position: { x: xOffset, y: position.y - 125 },
            name: '',
            data: {
              ...parent,
              label: `${parent.first_name} ${parent.last_name}`,
              connections: [...parent?.connections || [], {
                id: `${currentMember.node_id}-${parent.node_id}`,
                source: currentMember.node_id,
                target: parent.node_id
              }]
            }
          });
        } else {
          logger.info('ignoring family member\'s current parent as it is a dupe, ', { parent });
        }
      });
    }
    if (!membersWithCoords.find((newNode: any) => newNode.node_id === currentMember.node_id)) {
      membersWithCoords.push({
        ...currentMember,
        type: 'custom',
        position,
        data: { label: `${currentMember.first_name} ${currentMember.last_name}`, ...currentMember }
      });
    } else {
      logger.info('ignoring family member as it is a dupe, ', { node: currentMember });
    }
  });
  logger.info('newNodeState', membersWithCoords);
  return membersWithCoords;
}

async function createTree(treeData: APIFamilyTreeDAO, userId: number): Promise<ServiceResponseWithPayload<APIGetFamilyTreeResponse | null>> {
  let response: ServiceResponseWithPayload<APIGetFamilyTreeResponse | null> = { code: 500, error: true, payload: null };
  try {
    const currentUser = await User.findByPk(userId);
    if (currentUser?.dataValues) {
      const membersRecords = await generateTreeMembersRecords(treeData.members, userId)
        .catch((e: unknown) => {
          logger.error('Unable to bulk create members. Function call failed', e);
        });
      logger.info('membersRecords array', membersRecords);
      if (membersRecords) {
        const membersByNodeId =
          Object.values(membersRecords).reduce((nodeList: { [nodeId: string]: any }, curr: any) => {
            return ({ ...nodeList, [curr.node_id]: curr.dataValues });
          }, {});
        logger.info("Prepared object to create positions and edges", { membersByNodeId });
        const withCoords = positionFamilyMembers(Object.values(membersByNodeId));
        const newTree = await FamilyTree.create({
          active: 1,
          authorized_ips: '',
          created_by: userId,
          members: withCoords,
          name: treeData?.treeName || 'temporary_tree_name',
          public: 0
        })
        .catch((e: unknown) => {
          logger.error('Unable to create a tree ', e);
        });
        response.code = 200;
        response.error = false;
        response.payload = { ...newTree?.dataValues, members: withCoords };
      } else {
        response.code = 400;
        response.error = true;
        logger.error('Unable to create members: records array empty');
      }
    } else {
      response.code = 400;
      response.message = 'Invalid entries';
      response.error = true;
      logger.error('User not found');
    }
  } catch (e: unknown) {
    logger.error('! FamilyTree.create !', e);
    response.code = 400;
  }
  return response;
}

async function getTreeById(id: string): Promise<ServiceResponseWithPayload<FamilyTree | null>> {
  let response: ServiceResponseWithPayload<FamilyTree | null> = { code: 500, error: true, payload: null };
  try {
    const tree = await FamilyTree.findByPk(Number(id));
    if (!tree) {
      response.code = 404;
      response.error = true;
      response.message = 'Family tree not found';
      response.payload = null;
    } else {
      response.code = 200;
      response.error = false;
      response.message = 'Family tree fetched successfully';
      response.payload = tree;
    }
    return response;
  } catch (e: unknown) {
    logger.error('! FamilyTree.getOne !', e);
    response.message = 'Internal server error';
    return response;
  }
}

async function updateTree(updateData: any): Promise<ServiceResponseWithPayload<APIGetFamilyTreeResponse | null>> {
  let response: ServiceResponseWithPayload<APIGetFamilyTreeResponse | null> = { code: 500, error: true, payload: null };
  const { members, userId, treeId } = updateData;
  try {
    const tree = await FamilyTree.findByPk(treeId);
    if (!tree) {
      logger.error('Invalid treeId ', treeId);
      response.code = 400;
    } else {
      const membersRecords = await updateRecordAndRelations(members, userId, treeId);
      const withCoords = positionFamilyMembers(Object.values(membersRecords || {}));
      await tree.update({
        ...updateData,
        members: JSON.stringify(withCoords)
      });
      response.payload = tree;
      response.error = false;
      response.code = 200;
    }
  } catch (e: unknown) {
    logger.error('Unable to update tree ', e);
  }
  return response;
}

async function deleteTree(treeId: number): Promise<boolean> {
  try {
    const tree = await FamilyTree.findByPk(treeId);
    if (!tree) return false;
    await tree.destroy();
    return true;
  } catch (e: unknown) {
    logger.error('Failed to delete tree ', e);
    return false;
  }
}

async function addMembersToTree(treeId: number, newMembers: number[], userId: number): Promise<any> {
  try {
    const tree = await FamilyTree.findByPk(treeId);
    if (!tree) return null;
    const currentMembers = JSON.parse(tree.members || '[]');
    const updatedMembers = [...currentMembers, ...newMembers];
    await tree.update({ members: JSON.stringify(updatedMembers) });
    return tree;
  } catch (e: unknown) {
    logger.error('Failed to add members to tree ', e);
    return null;
  }
}

async function removeMembersFromTree(treeId: number, membersToRemove: number[]): Promise<boolean> {
  try {
    const tree = await FamilyTree.findByPk(treeId);
    if (!tree) return false;
    const currentMembers = JSON.parse(tree.members || '[]');
    const remainingMembers = currentMembers.filter((member: number) => !membersToRemove.includes(member));
    await tree.update({ members: JSON.stringify(remainingMembers) });
    return true;
  } catch (e: unknown) {
    logger.error('Failed to remove members from tree ', e);
    return false;
  }
}

async function getTreeMembers(treeId: number): Promise<FamilyMember[]> {
  try {
    const tree = await FamilyTree.findByPk(treeId);
    if (!tree) return [];
    return convertToFamilyMembers(tree?.members);
  } catch (e: unknown) {
    logger.error('! FamilyTree.getmembers !', e);
    return [];
  }
}

async function updateTreeMembers(treeId: number, members: FamilyMember[]): Promise<FamilyTree | null> {
  try {
    const tree = await FamilyTree.findByPk(treeId);
    if (!tree) return null;
    const membersJSON = convertToJSON(members);
    await tree.update({ members: membersJSON });
    return tree;
  } catch (e: unknown) {
    logger.error('Failed to update tree members ', e);
    return null;
  }
}

async function canUserViewTree(treeId: number, userId: number): Promise<boolean> {
  try {
    const tree = await FamilyTree.findByPk(treeId);
    if (!tree) return false;
    const members = convertToFamilyMembers(tree.members);
    return members.some((member: FamilyMember) => member.user_id == userId);
  } catch (e: unknown) {
    logger.error('! FamilyTree.isUserAuthorizedOntree ! ', e);
    return false;
  }
}

async function canUserUpdateTree(treeId: number, userId: number): Promise<boolean> {
  try {
    const tree = await FamilyTree.findByPk(treeId);
    if (!tree) return false;
    return tree.created_by === userId;
  } catch (e: unknown) {
    logger.error('! FamilyTree.isUserAuthorizedOntree ! ', e);
    return false;
  }
}

async function generateTreeMembersRecords(members: APIFamilyMemberDAO[] = [], userId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
  const anchor = members.find(m => !!m?.currentAnchor);
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
      return await getMembersFromCreateAction(anchor, userId);
    } else {
      logger.error('No record created, missing anchor node. Returning empty array');
      return null;
    }
  } catch (e: unknown) {
    logger.error('Unable to bulk create members ', e);
    return null;
  }
}

async function updateRecordAndRelations(members: { [nodeId: string]: APIFamilyMemberDAO }, userId: number, treeId?: number): Promise<{ [key: string]: APIFamilyMemberDAO } | null> {
  const data = members?.anchor;
  if (data) {
    const payload = await getMembersFromUpdateAction(data, treeId || 0);
    return payload;
  } else {
    logger.error('No anchor provided for update ', members);
  }
  return null;
}

async function getMembersFromCreateAction(data: APIFamilyMemberDAO, userId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
  const today = dayjs();
  const children = data?.children || [];
  const siblings = data?.siblings || [];
  const spouses = data?.spouses || [];
  const parents = data?.parents || [];
  logger.info('Received info to generate record ', data);
  data.age = today.diff(dayjs(data.dob), 'years');
  children?.forEach((c: any) => {
    c.age = today.diff(dayjs(c.dob), 'years');
    c.parents = [...c?.parents || [], data];
  });
  siblings?.forEach((s: any) => {
    s.siblings = [...s.siblings || [], data];
    s.age = today.diff(dayjs(s.dob), 'years');
  });
  parents?.forEach((p: any) => {
    p.age = today.diff(dayjs(p.dob), 'years');
    p.children = [...p?.children || [], data];
  });
  spouses?.forEach((s: any) => {
    s.age = today.diff(dayjs(s.dob), 'years');
    s.spouses = [...s?.spouses || [], data];
  });
  const payload: any = [data, ...children, ...siblings, ...parents, ...spouses];
  logger.info("Resulting flat array for members: ", { payload });
  const newMemberGroup: FamilyMember[] = [];
  for (const m of payload) {
    const duplicateRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: m.node_id } } });
    if (!duplicateRecord?.dataValues) {
      const addedRecord = await FamilyMember.create({
        ...m,
        description: m?.description || '',
        user_id: m?.userId || 0,
        created_by: 1,
        parents: m.parents,
        spouses: m.spouses,
        siblings: m.siblings,
        children: m.children,
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

async function getMembersFromUpdateAction(data: APIFamilyMemberDAO, treeId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
  const matchingRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: data.node_id } } });
  const matchingTree = await FamilyTree.findByPk(treeId);
  const kinshipMapping: { relation: APIFamilyMemberArrayKeys, inverseRelation: APIFamilyMemberArrayKeys, }[] = [
    { relation: 'children', inverseRelation: 'parents' }, { relation: 'siblings', inverseRelation: 'siblings' },
    { relation: 'parents', inverseRelation: 'children' }, { relation: 'spouses', inverseRelation: 'spouses' }
  ];
  let updatedRecord: FamilyMember | void;
  if (matchingRecord?.dataValues && matchingTree?.dataValues) {
    let unsavedfamilyMembers: any = [];
    let payload: any = {};
    logger.info('Found matching family member: ', matchingRecord.dataValues);
    for (const { relation, inverseRelation } of kinshipMapping) {
      const nodeIdsForKinshipType = (data?.[relation] || []).map((c: APIFamilyMemberDAO) => c.node_id) || [];
      if ( data?.[relation]?.length) {
        const existingRecords = await FamilyMember.findAll({ where: { node_id: { [Op.in]: nodeIdsForKinshipType } } });
        const existingRecordsData = existingRecords.map((r: any) => r.dataValues);
        logger.info('List of existing records ', existingRecordsData);
        const nodeIdsForExistingRecords = existingRecordsData?.map((r: FamilyMember) => {
          return r.node_id
        });
        const unsavedRecords = data?.[relation]?.filter((member: APIFamilyMemberDAO) => !nodeIdsForExistingRecords?.includes(member.node_id)) || [];
        unsavedfamilyMembers = [...unsavedfamilyMembers, ...unsavedRecords];
        logger.info('List of records to be added after check: ', { unsavedRecords, existingRecordsData });
        await Promise.all(
          unsavedRecords.map(async (c: APIFamilyMemberDAO) => {
            const savedRecord = await getMembersFromCreateAction({ ...c, [inverseRelation]: [data] }, data?.userId || 0);
            logger.info("saved record looks like this ", savedRecord);
            payload = { ...payload, ...savedRecord };
          })
        );
        updatedRecord = await matchingRecord.update({
          [relation]: JSON.stringify([...unsavedRecords, ...existingRecordsData || []])
        });
        logger.info('Resulting list of new records: ', { unsavedRecords, updatedRecord });
        if (updatedRecord?.id) {
          const treeMembers = JSON.parse(matchingTree.dataValues.members);
          logger.info('Members in related tree before update ', treeMembers);
          const indexOfUpdatedRecord = treeMembers.findIndex((member: any) => {
            member.id == updatedRecord?.id || 0;
          });
          if (indexOfUpdatedRecord) {
            treeMembers.splice(indexOfUpdatedRecord, 1, updatedRecord);
            logger.info('Found the member in a given tree and updated the members array with the new info: ', treeMembers);
            await matchingTree.update({ members: JSON.stringify(treeMembers) })
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

async function createRecords(members: { [stepName: string]: APIFamilyMemberDAO }, userId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
  const anchorKey = 'anchor';
  const anchor = members?.[anchorKey];
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
      return await getMembersFromCreateAction(anchor, userId);
    } else {
      logger.error('No record created, missing anchor node. Returning empty array');
      return null;
    }
  } catch (e: unknown) {
    logger.error('Unable to bulk create members ', e);
    return null;
  }
}

async function getMemberByNodeId(nodeId: string): Promise<FamilyMember | null> {
  try {
    return await FamilyMember.findOne({ where: { node_id: { [Op.eq]: nodeId } } });
  } catch (e: unknown) {
    logger.error('Failed to get member by node id:', e);
    return null;
  }
}

async function updateMember(id: number, updateData: any): Promise<FamilyMember | null> {
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

async function deleteMember(id: number): Promise<boolean> {
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

function positionFamilyMembersFromMemberService(members: APIFamilyMemberDAO[]): APIFamilyMemberDAO[] {
  const membersWithCoords: any = [];
  Object.values(members).forEach((currentMember: any, index: number) => {
    const position = { x: index * 125, y: 0 };
    const children = JSON.parse(currentMember?.children || '[]');
    const siblings = JSON.parse(currentMember?.siblings || '[]');
    const spouses = JSON.parse(currentMember?.spouses || '[]');
    const parents = JSON.parse(currentMember?.parents || '[]');
    logger.info("Collected all anchor's relatives", { children, parents, spouses, siblings, currentMember });
    if (Array.isArray(children)) {
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
    if (Array.isArray(siblings)) {
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
    if (Array.isArray(spouses)) {
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
    if (Array.isArray(parents)) {
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

export default {
  getAllTrees,
  positionFamilyMembers,
  createTree,
  getTreeById,
  updateTree,
  deleteTree,
  addMembersToTree,
  removeMembersFromTree,
  getTreeMembers,
  updateTreeMembers,
  canUserViewTree,
  canUserUpdateTree,
  generateTreeMembersRecords,
  updateRecordAndRelations,
  createRecords,
  getMemberByNodeId,
  updateMember,
  deleteMember,
  positionFamilyMembersFromMemberService,
};
