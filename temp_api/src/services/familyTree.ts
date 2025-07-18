import dayjs from "dayjs";
import { Op } from "sequelize";
import FamilyTree from "../models/FamilyTree";
import { APIFamilyMemberDAO, APIFamilyTreeDAO, APIGetFamilyTreeResponse, APIRequestPayload, CreateTreeRequestPayload, ServiceResponseWithPayload } from "./types";
import logger from "../utils/logger";
import User from "../models/User";
import FamilyMember from "../models/FamilyMember";
import { extractDataValuesFrom } from "./serviceHelpers";

// function convertToFamilyMembers(membersData: unknown): FamilyMember[] {
//   if (!membersData) return [];
//   const data = typeof membersData === 'string' ? JSON.parse(membersData) : membersData;
//   return data.map((memberData: any) => {
//     const member = new FamilyMember();
//     Object.assign(member, memberData);
//     return member;
//   });
// }

// function convertToJSON(members: FamilyMember[]): any {
//   return members.map(member => member.toJSON());
// };

export const getAllTrees = async (userId?: string): Promise<ServiceResponseWithPayload<FamilyTree[]>> => {
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
};

export const positionFamilyMembers = async (members: APIFamilyMemberDAO[]): Promise<APIFamilyMemberDAO[]> => {
  const membersWithCoords: APIFamilyMemberDAO[] = [];

  Object.values(members).forEach((currentMember: any, index: number) => {
    const position = { x: index * 125, y: 0 };
    const childrenNodeIds = currentMember?.children || [];
    const siblingsNodeIds = currentMember?.siblings || [];
    const spousesNodeIds = currentMember?.spouses || [];
    const parentsNodeIds = currentMember?.parents || [];
    logger.info("Collected all current member's relatives", { children: childrenNodeIds, parents: parentsNodeIds, spouses: spousesNodeIds, siblings: siblingsNodeIds, currentMember });

    childrenNodeIds.forEach((nodeId: string, childIndex: number) => {
      const incomingChildData = members.find((m: any) => m.node_id === nodeId);
      const formattedChildData = membersWithCoords.find((newNode: any) => newNode.node_id === nodeId);

      if (!formattedChildData && incomingChildData) {
        membersWithCoords.push({
          ...incomingChildData,
          type: 'custom',
          position: { x: position.x + (125 * (childIndex + 1)), y: position.y + 125 },
          name: `${incomingChildData.first_name} ${incomingChildData.last_name}`,
          connections: [{
            id: `${currentMember.node_id}-${incomingChildData.node_id}`,
            source: currentMember.node_id,
            target: incomingChildData.node_id
          }]
        });
      } else {
        logger.info('ignoring current child as it is a dupe, ', { child: nodeId });
      }
    });


    siblingsNodeIds.forEach((nodeId: string, siblingIndex: number) => {
      const incomingSiblingData = members.find((m: any) => m.node_id === nodeId);
      const formattedSiblingData = membersWithCoords.find((newNode: any) => newNode.node_id === nodeId);

      if (!formattedSiblingData && incomingSiblingData) {
        membersWithCoords.push({
          ...incomingSiblingData,
          type: 'custom',
          position: { x: position.x + (125 * (siblingIndex + 1)), y: position.y },
          name: `${incomingSiblingData.first_name} ${incomingSiblingData.last_name}`,
          connections: [{
            id: `${currentMember.node_id}-${incomingSiblingData.node_id}`,
            source: currentMember.node_id,
            target: incomingSiblingData.node_id
          }]
        });
      } else {
        logger.info('ignoring family member\'s current sibling as it is a dupe, ', { sibling: nodeId });
      }
    });

    spousesNodeIds.forEach((nodeId: string, spouseIndex: number) => {
      const incomingSpouseData = members.find((m: any) => m.node_id === nodeId);
      const formattedSpouseData = membersWithCoords.find((newNode: any) => newNode.node_id === nodeId);

      if (!formattedSpouseData && incomingSpouseData) {
        membersWithCoords.push({
          ...incomingSpouseData,
          type: 'custom',
          position: { x: position.x + (125 * (spouseIndex + 1)), y: position.y + 125 },
          name: `${incomingSpouseData.first_name} ${incomingSpouseData.last_name}`,
          connections: [{
            id: `${currentMember.node_id}-${incomingSpouseData.node_id}`,
            source: currentMember.node_id,
            target: incomingSpouseData.node_id
          }]
        });
      } else {
        logger.info('ignoring family member\'s current spouse as it is a dupe, ', { spouse: nodeId });
      }
    });

    parentsNodeIds.forEach((nodeId: string, parentIndex: number) => {
      const incomingParentData = members.find((m: any) => m.node_id === nodeId);
      const formattedParentData = membersWithCoords.find((newNode: any) => newNode.node_id === nodeId);

      if (!formattedParentData && incomingParentData) {
        membersWithCoords.push({
          ...incomingParentData,
          type: 'custom',
          position: { x: position.x + (125 * (parentIndex + 1)), y: position.y + 125 },
          name: `${incomingParentData.first_name} ${incomingParentData.last_name}`,
          connections: [{
            id: `${currentMember.node_id}-${incomingParentData.node_id}`,
            source: currentMember.node_id,
            target: incomingParentData.node_id
          }]
        });
      } else {
        logger.info('ignoring family member\'s current parent as it is a dupe, ', { parent: nodeId });
      }
    });

    if (!membersWithCoords.find((newNode: any) => newNode.node_id === currentMember.node_id) && currentMember.currentAnchor) {
      membersWithCoords.push({
        ...currentMember,
        type: 'custom',
        position,
        name: `${currentMember.first_name} ${currentMember.last_name}`
      });
    } else {
      logger.info('Current member is not the anchor, ', { node: currentMember });
    }
  });

  logger.info('newNodeState', membersWithCoords);
  return membersWithCoords;
};

/**
 * 
 * @param createData : form values for each tree member.
 *  used to create a record for each and to build the members array in the new tree instance
 * @returns FamilyTree
 */
export const createTree = async (createData: CreateTreeRequestPayload): Promise<ServiceResponseWithPayload<APIGetFamilyTreeResponse | null>> => {
  const { data, userId } = createData;
  let response: ServiceResponseWithPayload<APIGetFamilyTreeResponse | null> = { code: 500, error: true, payload: null };

  try {
    const currentUser = await extractDataValuesFrom(User, { id: userId });

    if (currentUser) {
      const membersRecords = await generateTreeMembersRecords(data.members, userId)
      logger.info('membersRecords array', membersRecords);

      if (membersRecords) {
        // @ts-ignore
        const withCoords = await positionFamilyMembers(Object.values(membersRecords));
        const newTree = await FamilyTree.create({
          active: 1,
          authorized_ips: '',
          created_by: userId,
          // @ts-ignore
          members: withCoords,
          name: data?.treeName || 'temporary_tree_name',
          public: 0
        })
          .catch((e: unknown) => {
            logger.error('Unable to create a tree ', e);
          });
        response.code = 200;
        response.error = false;
        // @ts-ignore
        response.payload = { ...newTree?.dataValues, members: withCoords };
      } else {
        logger.error('Unable to create members: records array empty');
      }
    } else {
      response.code = 500;
      response.message = 'Invalid entries';
      response.error = true;
      logger.error('User not found');
    }
  } catch (e: unknown) {
    logger.error('! FamilyTree.create !', e);
    response.code = 500;
  }
  return response;
};

export const getTreeById = async (id: string): Promise<ServiceResponseWithPayload<FamilyTree | null>> => {
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
};

// async function updateTree(updateData: any): Promise<ServiceResponseWithPayload<APIGetFamilyTreeResponse | null>> {
//   let response: ServiceResponseWithPayload<APIGetFamilyTreeResponse | null> = { code: 500, error: true, payload: null };
//   const { members, userId, treeId } = updateData;
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) {
//       logger.error('Invalid treeId ', treeId);
//       response.code = 400;
//     } else {
//       const membersRecords = await updateRecordAndRelations(members, userId, treeId);
//       const withCoords = positionFamilyMembers(Object.values(membersRecords || {}));
//       await tree.update({
//         ...updateData,
//         members: JSON.stringify(withCoords)
//       });
//       response.payload = tree;
//       response.error = false;
//       response.code = 200;
//     }
//   } catch (e: unknown) {
//     logger.error('Unable to update tree ', e);
//   }
//   return response;
// };

export const deleteTree = async (treeId: number): Promise<ServiceResponseWithPayload<null>> => {
  let response: ServiceResponseWithPayload<null> = { code: 500, error: true, payload: null };

  try {
    const tree = await FamilyTree.findByPk(treeId);

    if (!tree) {
      logger.error('Tree does not exist. Cannot delete', { treeId });
    } else {
      await tree.destroy();
      response = {
        ...response, code: 200, error: false
      };
    }
  } catch (e: unknown) {
    logger.error('Failed to delete tree ', e);
  }

  return response;
};

// async function addMembersToTree(treeId: number, newMembers: number[], userId: number): Promise<any> {
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) return null;
//     const currentMembers = JSON.parse(tree.members || '[]');
//     const updatedMembers = [...currentMembers, ...newMembers];
//     await tree.update({ members: JSON.stringify(updatedMembers) });
//     return tree;
//   } catch (e: unknown) {
//     logger.error('Failed to add members to tree ', e);
//     return null;
//   }
// }

// async function removeMembersFromTree(treeId: number, membersToRemove: number[]): Promise<boolean> {
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) return false;
//     const currentMembers = JSON.parse(tree.members || '[]');
//     const remainingMembers = currentMembers.filter((member: number) => !membersToRemove.includes(member));
//     await tree.update({ members: JSON.stringify(remainingMembers) });
//     return true;
//   } catch (e: unknown) {
//     logger.error('Failed to remove members from tree ', e);
//     return false;
//   }
// }

// async function getTreeMembers(treeId: number): Promise<FamilyMember[]> {
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) return [];
//     return convertToFamilyMembers(tree?.members);
//   } catch (e: unknown) {
//     logger.error('! FamilyTree.getmembers !', e);
//     return [];
//   }
// }

// async function updateTreeMembers(treeId: number, members: FamilyMember[]): Promise<FamilyTree | null> {
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) return null;
//     const membersJSON = convertToJSON(members);
//     await tree.update({ members: membersJSON });
//     return tree;
//   } catch (e: unknown) {
//     logger.error('Failed to update tree members ', e);
//     return null;
//   }
// }

// async function canUserViewTree(treeId: number, userId: number): Promise<boolean> {
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) return false;
//     const members = convertToFamilyMembers(tree.members);
//     return members.some((member: FamilyMember) => member.user_id == userId);
//   } catch (e: unknown) {
//     logger.error('! FamilyTree.isUserAuthorizedOntree ! ', e);
//     return false;
//   }
// }

// async function canUserUpdateTree(treeId: number, userId: number): Promise<boolean> {
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) return false;
//     return tree.created_by === userId;
//   } catch (e: unknown) {
//     logger.error('! FamilyTree.isUserAuthorizedOntree ! ', e);
//     return false;
//   }
// };

const generateTreeMembersRecords = async (members: APIFamilyMemberDAO[] = [], userId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> => {
  const today = dayjs();
  const newMemberGroup: any = [];
  const nodeIdList = members.map(m => m.node_id);
  const duplicateRecords = await FamilyMember.findAll({ where: { node_id: { [Op.in]: nodeIdList } } });
  logger.info('dupli ', { duplicateRecords, nodeIdList });

  for (const m of members) {
    if (!duplicateRecords || !duplicateRecords?.find((r: any) => r.node_id === m.node_id)) {
      newMemberGroup.push({
        ...m,
        age: today.diff(dayjs(m.dob), 'years'),
        description: m?.description || '',
        user_id: null,
        created_by: userId,
        parents: m.parents,
        spouses: m.spouses,
        siblings: m.siblings,
        children: m.children,
      });
    }
  };

  if (newMemberGroup.length) {
    logger.info('PREPARE FOR CREATE ', newMemberGroup)
    const newRecords = await FamilyMember.bulkCreate(newMemberGroup);
    logger.info('All new members created: ', { newRecords });
    const newMembersMap: any = newRecords.reduce((map: { [nodeId: string]: FamilyMember }, currentMember: any) => { //TODO: any
      return ({ ...map, [currentMember.dataValues?.node_id || currentMember.dataValues.id]: currentMember.dataValues }); // TODO: node_id should be mandatory somehow
    }, {});

    return newMembersMap;
  } else {
    logger.error('Unable to bulk create members, no records created');
  }

  return null;
};

// async function getMembersFromUpdateAction(data: APIFamilyMemberDAO, treeId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
//   const matchingRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: data.node_id } } });
//   const matchingTree = await FamilyTree.findByPk(treeId);
//   const kinshipMapping: { relation: APIFamilyMemberArrayKeys, inverseRelation: APIFamilyMemberArrayKeys, }[] = [
//     { relation: 'children', inverseRelation: 'parents' }, { relation: 'siblings', inverseRelation: 'siblings' },
//     { relation: 'parents', inverseRelation: 'children' }, { relation: 'spouses', inverseRelation: 'spouses' }
//   ];
//   let updatedRecord: FamilyMember | void;
//   if (matchingRecord?.dataValues && matchingTree?.dataValues) {
//     let unsavedfamilyMembers: any = [];
//     let payload: any = {};
//     logger.info('Found matching family member: ', matchingRecord.dataValues);
//     for (const { relation, inverseRelation } of kinshipMapping) {
//       const nodeIdsForKinshipType = (data?.[relation] || []).map((c: APIFamilyMemberDAO) => c.node_id) || [];
//       if ( data?.[relation]?.length) {
//         const existingRecords = await FamilyMember.findAll({ where: { node_id: { [Op.in]: nodeIdsForKinshipType } } });
//         const existingRecordsData = existingRecords.map((r: any) => r.dataValues);
//         logger.info('List of existing records ', existingRecordsData);
//         const nodeIdsForExistingRecords = existingRecordsData?.map((r: FamilyMember) => {
//           return r.node_id
//         });
//         const unsavedRecords = data?.[relation]?.filter((member: APIFamilyMemberDAO) => !nodeIdsForExistingRecords?.includes(member.node_id)) || [];
//         unsavedfamilyMembers = [...unsavedfamilyMembers, ...unsavedRecords];
//         logger.info('List of records to be added after check: ', { unsavedRecords, existingRecordsData });
//         await Promise.all(
//           unsavedRecords.map(async (c: APIFamilyMemberDAO) => {
//             const savedRecord = await getMembersFromCreateAction({ ...c, [inverseRelation]: [data] }, data?.userId || 0);
//             logger.info("saved record looks like this ", savedRecord);
//             payload = { ...payload, ...savedRecord };
//           })
//         );
//         updatedRecord = await matchingRecord.update({
//           [relation]: JSON.stringify([...unsavedRecords, ...existingRecordsData || []])
//         });
//         logger.info('Resulting list of new records: ', { unsavedRecords, updatedRecord });
//         if (updatedRecord?.id) {
//           const treeMembers = JSON.parse(matchingTree.dataValues.members);
//           logger.info('Members in related tree before update ', treeMembers);
//           const indexOfUpdatedRecord = treeMembers.findIndex((member: any) => {
//             member.id == updatedRecord?.id || 0;
//           });
//           if (indexOfUpdatedRecord) {
//             treeMembers.splice(indexOfUpdatedRecord, 1, updatedRecord);
//             logger.info('Found the member in a given tree and updated the members array with the new info: ', treeMembers);
//             await matchingTree.update({ members: JSON.stringify(treeMembers) })
//             treeMembers.forEach((member: any) => {
//               logger.info('Does this have the actual record data? ', { member });
//               payload[member.id] = member
//             })
//           }
//         }
//       }
//     }
//     logger.info('Final payload ', { ...payload });
//     return payload;
//   } else {
//     logger.error('No record matches the member to update ', data);
//   }
//   return null;
// };

// async function updateMember(id: number, updateData: any): Promise<FamilyMember | null> {
//   try {
//     const member = await FamilyMember.findByPk(id);
//     if (!member) return null;
//     await member.update(updateData);
//     return member;
//   } catch (e: unknown) {
//     logger.error('Failed to update member:', e);
//     return null;
//   }
// };

// async function deleteMember(id: number): Promise<boolean> {
//   try {
//     const member = await FamilyMember.findByPk(id);
//     if (!member) return false;
//     await member.destroy();
//     return true;
//   } catch (e: unknown) {
//     logger.error('Failed to delete member:', e);
//     return false;
//   }
// };