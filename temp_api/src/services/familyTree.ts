import dayjs from "dayjs";
import { Op } from "sequelize";
import FamilyTree from "../models/FamilyTree";
import { APIFamilyMemberDAO, APIFamilyMemberRecord, APIFamilyTreeDAO, APIGetFamilyTreeResponse, APIRequestPayload, CreateTreeAPIResponse, KinshipEnum, ManageTreeRequestPayload, MappedFamilyMembers, ServiceResponseWithPayload } from "./types";
import logger from "../utils/logger";
import User from "../models/User";
import FamilyMember from "../models/FamilyMember";
import { extractGroupDataValuesFrom, extractSingleDataValuesFrom } from "./serviceHelpers";

export const getAllTrees = async (userId: string): Promise<ServiceResponseWithPayload<FamilyTree[]>> => {
  let response: APIRequestPayload<FamilyTree[]> = { code: 500, error: true, payload: [] };
  let treeList: FamilyTree[] = [];

  try {
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
  } catch (e: unknown) {
    response.code = 500;
    logger.error('Unable to fetch trees ', e);
  }
  response.payload = treeList;
  return response;
};

/**
 * ? Receives FamilyMember[], update the position properties and return the list of records post update
 * @param members 
 * @param anchorNodeId 
 * @returns APIFamilyMemberRecord[]
 */
export const positionFamilyMembers = async (members: FamilyMember[], anchorNodeId: string): Promise<APIFamilyMemberRecord[]> => {
  const membersWithCoords: APIFamilyMemberRecord[] = [];
  const anchor = members.find(m => m.dataValues.node_id === anchorNodeId);

  // go through all the anchor and its relative, and update the positions based on the anchor's position. make sure to use existing position if already available
  if (anchor) {
    // position every one of the anchor's relatives
    const position = JSON.parse(anchor?.dataValues?.position || '{ "x": 0, "y": 0 }');
    const childrenNodeIds: string[] = JSON.parse(anchor?.dataValues?.children || '[]');
    const siblingsNodeIds: string[] = JSON.parse(anchor?.dataValues?.siblings || '[]');
    const spousesNodeIds: string[] = JSON.parse(anchor?.dataValues?.spouses || '[]');
    const parentsNodeIds: string[] = JSON.parse(anchor?.dataValues?.parents || '[]');
    const childrenList = await bulkUpdateRecordsPosition(childrenNodeIds, members, position, KinshipEnum.child, anchorNodeId);
    const siblingsList = await bulkUpdateRecordsPosition(siblingsNodeIds, members, position, KinshipEnum.sibling, anchorNodeId);
    const parentsList = await bulkUpdateRecordsPosition(parentsNodeIds, members, position, KinshipEnum.parent, anchorNodeId);
    const spousesList = await bulkUpdateRecordsPosition(spousesNodeIds, members, position, KinshipEnum.spouse, anchorNodeId);

    // add them all to the list of members
    membersWithCoords.push(...childrenList);
    membersWithCoords.push(...siblingsList);
    membersWithCoords.push(...parentsList);
    membersWithCoords.push(...spousesList);
    // once thats done, position the current member themselves
    membersWithCoords.push({
      ...anchor.dataValues,
      // type: 'custom',
      position: JSON.stringify(position),
      //! connections
      
      // name: `${anchor.first_name} ${anchor.last_name}`
    });

    logger.info('newNodeState', membersWithCoords);
    return membersWithCoords;
  } else {
    logger.error('No anchor provided. ', members);
  }

  return [];
};

/**
 * 
 * ? used to create a record for each and to build the members array in the new tree instance
 * @param createData : form values for each tree member.
 * @returns FamilyTree
 */
export const createTree = async (createData: ManageTreeRequestPayload): CreateTreeAPIResponse => {
  const { data, userId } = createData;
  let response: ServiceResponseWithPayload<APIGetFamilyTreeResponse | null> = { code: 500, error: true, payload: null };

  try {
    const currentUser = await extractSingleDataValuesFrom(User, { id: userId });

    if (currentUser) {
      const membersRecords = await generateTreeMembersRecords(data.members, userId);

      if (membersRecords) {
        const withCoords = await positionFamilyMembers(Object.values(membersRecords), data.anchor);
        logger.info('Members After positionning', { withCoords });
        const nodeIdList = JSON.stringify(Object.keys(withCoords));
        const newTree = await FamilyTree.create({
          active: 1,
          authorized_ips: '',
          created_by: userId,
          members: nodeIdList,
          name: data?.treeName || '',
          public: 0
        })
          .catch((e: unknown) => {
            logger.error('Unable to create a tree ', e);
          });
        response.code = 200;
        response.error = false;
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

/**
 * @param updateData: updated list of existing family members (and new ones if any). Deletions will be handled separately
 * @returns CreateTreeAPIResponse
 */
export const updateTree = async (updateData: ManageTreeRequestPayload): CreateTreeAPIResponse => {
  let response: ServiceResponseWithPayload<any | null> = { code: 500, error: true, payload: null };
  const { userId, data } = updateData;

  try {
    const tree = await FamilyTree.findByPk(data?.treeId || 0);;

    if (!tree?.dataValues?.id) {
      logger.error('Invalid entries ', data);
    } else {
      const updatedMembersRecords = await updateTreeMembers(tree, userId, data);
      // use data from the members post update (important properties may have changed. i.e name or kinship)
      const membersRecordsFromUpdate = await extractGroupDataValuesFrom(FamilyMember, { where: { node_id: { [Op.in]: Object.keys(updatedMembersRecords || []) } } });
      const withCoords = await positionFamilyMembers(Object.values(membersRecordsFromUpdate || {}), data.anchor);
      logger.info('withcoords', withCoords)
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
};

/**
 * 
 * @param tree : includes list of members as currently stored in db
 * @param userId 
 * @param updateData: member and tree updates
 */
// TODO: there are more validations to be done here
const updateTreeMembers = async (tree: FamilyTree, userId: number, updateData: APIFamilyTreeDAO): Promise<{ [id: string]: FamilyMember } | null> => {
  logger.info('Args to members process ', { tree, userId, updateData })
  const allNodeIds = updateData.members.map(m => m.node_id);
  const existingMembersNodeIds = tree.members;
  const newRecords: any = []; //TODO: fix bulkcreate ops typing
  const updatedRecords: any[] = [];
  const mappedMembers: any = {};
  let newMembersRecords: any[] = [];
  const newMembers = updateData.members.filter(m => !existingMembersNodeIds.includes(m.node_id));

  if (newMembers.length) {
    logger.info('Tree update includes new members', newMembers);
    const today = dayjs();

    for (const m of newMembers) {
      // there shouldnt be any duplicates here
      logger.info('Current tree member ', m, tree)
      newRecords.push({
        ...m,
        age: today.diff(dayjs(m.dob), 'years'),
        description: m?.description || '',
        created_by: userId,
        parents: m.parents,
        spouses: m.spouses,
        siblings: m.siblings,
        children: m.children,
      });
    };
  }

  if (newRecords.length) {
    // create records for any family member that doesnt already have one. 
    // No need to update the existing relatives, since node_id remains the same
    newMembersRecords = await FamilyMember.bulkCreate(newRecords);
    // (...)
  }

  //add the newly created records to the mapped records object
  newMembersRecords.forEach((r: APIFamilyMemberDAO) => {
    logger.info('Newly created record to add ', r);
    updatedRecords.push(r);
  });

  await Promise.all(updateData.members.map(async (m) => {
    const memberRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: m.node_id } } });

    if (memberRecord?.dataValues) {
      const recordWithUpdates = await memberRecord.update({
        ...memberRecord.dataValues,
        ...m,
        position: '', //! to fix next
        connections: '',
        children: JSON.stringify(m?.children || '[]'),
        parents: JSON.stringify(m?.parents || '[]'),
        siblings: JSON.stringify(m?.siblings || '[]'),
        spouses: JSON.stringify(m?.spouses || '[]'),
        age: memberRecord.age // form comes in with null for age. avoid replacing it
      });
      logger.info('Updated. Return value is ', recordWithUpdates);
      updatedRecords.push(recordWithUpdates.dataValues);
    } else {
      logger.error('Invalid record provided ', m);
    }
  }));

  logger.info('Records After all updates', updatedRecords);
  const result = updatedRecords.reduce((map: { [nodeId: string]: APIFamilyMemberDAO }, curr: any) => ({ ...map, [curr.node_id]: curr }), {});

  return result;//includes both new and existing records
};

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

// export const function = async  canUserUpdateTree(treeId: number, userId: number): Promise<boolean> {
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) return false;
//     return tree.created_by === userId;
//   } catch (e: unknown) {
//     logger.error('! FamilyTree.isUserAuthorizedOntree ! ', e);
//     return false;
//   }
// };

/**
 * Goes through all the family members submintted, creates records for each
 * is ignored if any of those memeber already has a record since this is part of the initial create action
 * @param members 
 * @param userId 
 */
const generateTreeMembersRecords = async (members: APIFamilyMemberDAO[] = [], userId: number): Promise<{ [id: string]: FamilyMember } | null> => {
  const today = dayjs();
  const newMemberGroup: any[] = [];
  const nodeIdList = members.map(m => m.node_id);
  //! using the native query rather than the helper function, I need the ability to update later on 
  const duplicateRecords = await FamilyMember.findAll({ where: { node_id: { [Op.in]: nodeIdList } } });
  logger.info('dupli ', { duplicateRecords, nodeIdList });

  for (const m of members) {
    const matchInDulicateRecords = duplicateRecords?.find((r: any) => r.dataValues.node_id === m.node_id);
    logger.info('member in list ', m);
    if (!matchInDulicateRecords) {
      newMemberGroup.push({
        ...m,
        age: today.diff(dayjs(m.dob), 'years'),
        description: m?.description || '',
        created_by: userId,
        parents: JSON.stringify(m.parents),
        spouses: JSON.stringify(m.spouses),
        siblings: JSON.stringify(m.siblings),
        children: JSON.stringify(m.children),
      });
    }
  };

  if (newMemberGroup.length) {
    const newRecords = await FamilyMember.bulkCreate(newMemberGroup);
    logger.info('All new members created: ', { newRecords });
    const newMembersMap: MappedFamilyMembers = newRecords.reduce((map: { [nodeId: string]: FamilyMember }, currentMember: any) => { //TODO: any
      return ({ ...map, [currentMember.dataValues.node_id]: currentMember });
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
//       if (data?.[relation]?.length) {
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

/**
 * @param nodeIds 
 * @param membersList 
 * @param initialPosition 
 * @param relation 
 * @param anchor 
 */
const bulkUpdateRecordsPosition = async (nodeIds: string[], membersList: FamilyMember[], initialPosition: { x: number, y: number }, relation: KinshipEnum, anchor: string): Promise<FamilyMember[]> => {
  const result: FamilyMember[] = [];

  await Promise.all(nodeIds.map(async (nodeId: string, nodeIndex: number) => {
    logger.info('Processing member inside the promise all bulk update: ', { nodeIds, membersList, nodeId });
    const existingRecordForRelative = membersList.find((m: FamilyMember) => m.dataValues.node_id === nodeId);
    // const formattedDataForRelative = membersWithCoords.find((newNode: any) => newNode.node_id === nodeId);
    let offset = { x: 0, y: 0 };

    // calculate the offset in the graphic tree based on kinship
    switch (relation) {
      case KinshipEnum.child:
        offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y + 125 }
        break;
      case KinshipEnum.sibling:
        offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y }
        break;
      case KinshipEnum.spouse:
        offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y };
        break;
      case KinshipEnum.parent:
        offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y + 125 };
        break;
    }

    logger.info('Offset based on current relation ', offset);
    // update record of current relative with the offset
    if (existingRecordForRelative) { //previous version would check if duplicate in an array. see memberwithcoords in commented code
      const relativeUpdated = await existingRecordForRelative.update({
        position: JSON.stringify(offset),
        connections: JSON.stringify([{
          id: `${anchor}-${existingRecordForRelative.node_id}`,
          source: anchor,
          target: existingRecordForRelative.node_id
        }])
      });
      result.push(relativeUpdated);
    } else {
      logger.info('ignoring current child as it is a dupe, ', { relative: nodeId });
    }

    // add the anchor and apply the initial position (it may be an existing prop, need to check if equal then update only if !=)
    result.push()
  }));
  logger.info('Result after all positions updates', result);
  return result;
};