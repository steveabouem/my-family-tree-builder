import dayjs from "dayjs";
import { Op } from "sequelize";
import FamilyTree from "../models/FamilyTree";
import {
  FamilyTreeFormData, APIGetFamilyTreeResponse,
  APIRequestPayload, FamilyMemberData, ManageTreeAPIResponse, ManageTreeRequestPayload,
  MappedFamilyMembers, ServiceResponseWithPayload
} from "./types";
import logger from "../utils/logger";
import User from "../models/User";
import FamilyMember from "../models/FamilyMember";
import { extractSingleDataValuesFrom } from "./serviceHelpers";
import { KinshipEnum } from "./types";

//#region getAllTrees
export const getAllTrees = async (userId: string): Promise<ServiceResponseWithPayload<FamilyTree[]>> => {
  const id = Number(userId);
  let response: APIRequestPayload<FamilyTree[]> = { code: 500, error: true, payload: [] };
  let treeList: FamilyTree[] = [];

  try {
    const userRecord: User | null = await User.findByPk(id);
    logger.info('Curr user ', { userRecord: userRecord?.email });

    if (userRecord) {
      treeList = await FamilyTree.findAll({
        where: {
          [Op.or]: {
            emails: {
              [Op.like]: `%${userRecord.email}%`
            },
            created_by: {
              [Op.eq]: id
            }
          }
        },
      });
      await Promise.all(treeList.map(async (t: FamilyTree) => {
        const memberRecords = await FamilyMember.findAll({ where: { node_id: { [Op.in]: JSON.parse(t.members) } } });
        // TODO: the type of the response will account for this array being string or records
        // @ts-ignore
        t.members = memberRecords
      }));
      logger.info('Trees ', { treeList });
      response.payload = treeList;
      response.code = 200;
      response.error = false;
      response.message = 'Fetched tree successfully.'
    }
  } catch (e: unknown) {
    response.code = 500;
    logger.error('Unable to fetch trees ', e);
  }
  response.payload = treeList;

  return response;
};
//#endregion

//#region positionFamilyMembers
/**
 * ? Receives FamilyMember[], update the position properties and return the list of RAW (dataValues) records post update
 * @param members 
 * @param anchorNodeId 
 * @returns FamilyMember[]
 */
export const positionFamilyMembers = async (members: FamilyMemberData[], anchorNodeId: string): Promise<FamilyMemberData[]> => {
  const membersWithCoords: FamilyMemberData[] = [];
  const anchor = members.find(m => m.node_id === anchorNodeId);
  logger.info('FOUND ANCHOR ', { anchor })
  // go through all the anchor and its relative, and update the positions based on the anchor's position. make sure to use existing position if already available
  if (anchor) {
    logger.info('Anchor data is ', { anchor })
    // position every one of the anchor's relatives
    const position = { x: anchor?.position?.x || 0, y: anchor?.position?.y || 0 };
    const childrenNodeIds: string[] = anchor?.children || [];
    const siblingsNodeIds: string[] = anchor?.siblings || [];
    const spousesNodeIds: string[] = anchor?.spouses || [];
    const parentsNodeIds: string[] = anchor?.parents || [];
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
      ...anchor,
      type: 'custom',
      position: {x: 0, y: 0}
      // name: `${anchor.first_name} ${anchor.last_name}`
    });

    logger.info('newNodeState', membersWithCoords);
    return membersWithCoords;
  } else {
    logger.error('No anchor provided. ', members);
  }

  return [];
};
//#endregion

//#region createTree
/**
 * ? used to create a record for each and to build the members array in the new tree instance
 * ? the returned payload only holds the member's node ids for simplicity
 * @param createData : form values for each tree member.
 * @returns FamilyTree
 */
export const createTree = async (createData: ManageTreeRequestPayload): ManageTreeAPIResponse => {
  // TODO: there is no check for existing members with same name and dob (or other prop). Duplicates are possible as it stands
  // !one way could be to encode every node_id with the treeID,  I cant think of a check that involves anything else than the family tree name/id
  // ! last names can be very common, there could be two Abanda families for which the dad's first name is the same.
  // ! I could check query the db for members with same name and dob, and block if more than 1/2 has the exact same last name/dob. But it feels risky
  // ! a reasonable approach top of mind would be finding any trees where current user's user_id exist, and either limit to 1 tree per user id, or check number of duplicates in the list of members? 
  const { data, userId } = createData;
  let response: ServiceResponseWithPayload<APIGetFamilyTreeResponse | null> = { code: 500, error: true, payload: null };

  try {
    const currentUser = await extractSingleDataValuesFrom(User, { id: userId });

    if (currentUser) {
      // TODO: it would be best if positionnning happens before creating the record so that db is only updated once instead of twice +
      const membersRecords = await generateTreeMembersRecords(data.members, userId);
      logger.info('RETURNED MEMBER RECORDS', { membersRecords });
      if (membersRecords) {
        const withCoords = await positionFamilyMembers(Object.values(membersRecords), data.anchor);
        logger.info('Members After positionning', { withCoords });
        const nodeIdList = withCoords.map((curr: FamilyMemberData) => curr.node_id);
        const emailList = withCoords.map((curr: FamilyMemberData) => curr.email);
        const newTree = await FamilyTree.create({
          active: 1,
          authorized_ips: '',
          created_by: userId,
          members: JSON.stringify(nodeIdList),
          emails: JSON.stringify(emailList),
          name: data?.treeName || '',
          public: 0
        })
          .catch((e: unknown) => {
            logger.error('Unable to create a tree ', e);
          });
        response.code = 200;
        response.error = false;

        const detailedListOfMembers = await getAllRelativesData(newTree);
        response.payload = { ...newTree?.dataValues, members: detailedListOfMembers || [] };
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
//#endregion

//#region getTreeById
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
//#endregion

//#region updateTree
/**
 * ? Receives info on an existing Tree (list of members to update and requesting user),
 * ? updates the selected members' positions, connections and potentially properties. Returns the updated tree info
 * @param updateData: list of existing/new family members. List is not automacially exhaustive,
 * since update will typically be based on either a single member, or a list of new ones.
 * Deletions will be handled separately
 * @returns FamilyTree
 */
export const updateTree = async (updateData: ManageTreeRequestPayload): ManageTreeAPIResponse => {
  let response: ServiceResponseWithPayload<any | null> = { code: 500, error: true, payload: null };
  const { userId, data } = updateData;

  try {
    const tree = await FamilyTree.findByPk(data?.treeId || 0);

    if (!tree?.dataValues?.id) {
      logger.error('Invalid entries ', data);
    } else {
      const updatedMembersRecords = await updateTreeMembers(tree, userId, data);
      // use data from the members post update: important properties may have changed. i.e name or kinship
      // TODO: the front seems to not make a two way update of the kinship arrays: 
      // ! if I add a sibling sometimes it adds it to the payload, but doesn tupdate its own kinship array. Some other times
      // ! some other timeStamp, when I add a new membersRecordsFromUpdate, only the old ones are sent? not sure I saw this right
      // ! to the form, only the  existing member's kinship array will be updated. this might be the reaons why update tree doesnt work
      const membersRecordsFromUpdate = await FamilyMember.findAll({ where: { node_id: { [Op.in]: Object.keys(updatedMembersRecords || []) } } });
      const formattedMembers = membersRecordsFromUpdate.map((m: FamilyMember) => formatFamilyMemberToFront(m));
      const withCoords = await positionFamilyMembers(formattedMembers, data.anchor);
      const nodeIdList = withCoords.map((curr) => curr.node_id);
      const emailList = withCoords.map((curr) => curr.email);
      logger.info('withcoords', withCoords)
      const updatedTree = await tree.update({
        ...updateData,
        members: JSON.stringify(nodeIdList),
        emails: JSON.stringify(emailList),
      });

      response.payload = { ...updatedTree.dataValues, members: withCoords };
      response.error = false;
      response.code = 200;
    }
  } catch (e: unknown) {
    logger.error('Unable to update tree ', e);
  }

  return response;
};
//#endregion

/**
 * 
 * @param tree : includes list of members as currently stored in db
 * @param userId 
 * @param updateData: member and tree updates
 */
//#region updateTreeMembers
// TODO: there are more validations to be done here
const updateTreeMembers = async (tree: FamilyTree, userId: number, updateData: FamilyTreeFormData): Promise<{ [id: string]: FamilyMember } | null> => {
  const existingMembersNodeIds = JSON.parse(tree.members);
  logger.info('This should be an array of node_id', { existingMembersNodeIds, members: updateData.members });
  const newRecords: any = []; //TODO: fix bulkcreate ops typing
  const updatedRecords: any[] = [];
  const newMembers = updateData.members.filter((m: FamilyMemberData) => !existingMembersNodeIds.includes(m.node_id));
  let newMembersRecords: any[] = [];
  logger.info('This should not contain anything else than brand new members', { newMembers });

  if (newMembers.length) {
    const today = dayjs();
    logger.info('Tree update includes new members', newMembers);

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
    newMembersRecords = await FamilyMember.bulkCreate(newRecords);
    // (...)
  }

  //add the newly created records to the mapped records object
  newMembersRecords.forEach((r: FamilyMemberData) => {
    logger.info('Newly created record to add ', r);
    updatedRecords.push({ ...r });
  });

  await Promise.all(updateData.members.map(async (m) => {
    // todo: its better to do the findall then loop the result of that. 1 query instead of potential dozen
    const memberRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: m.node_id } } });

    if (memberRecord?.dataValues) {// TODO: what if any of htese arrays exist and are just being expanded rather than replaced? Front must handle that? No
      const newChildren = m?.children?.length ? JSON.stringify(m?.children) : memberRecord.dataValues?.children;
      const newParents = m?.parents?.length ? JSON.stringify(m?.parents) : memberRecord.dataValues?.parents;
      const newSiblings = m?.siblings?.length ? JSON.stringify(m?.siblings) : memberRecord.dataValues?.siblings;
      const newSpouses = m?.spouses?.length ? JSON.stringify(m?.spouses) : memberRecord.dataValues?.spouses;
      const newPosition = m?.position?.x ? JSON.stringify(m.position) : memberRecord.dataValues?.position;
      const newConnections = m?.connections?.length ? JSON.stringify(m.connections) : memberRecord.dataValues?.connections;
      const recordWithUpdates = await memberRecord.update({
        ...memberRecord.dataValues,
        ...m,
        position: newPosition,
        connections: newConnections,
        children: newChildren,
        parents: newParents,
        siblings: newSiblings,
        spouses: newSpouses,
        age: memberRecord.age // form comes in with null for age. avoid replacing it
      });
      logger.info('Updated. Return value is ', recordWithUpdates);
      updatedRecords.push({ ...recordWithUpdates.dataValues });
    } else {
      logger.error('Invalid record provided ', m);
    }
  }));

  logger.info('Records After all updates', updatedRecords);
  const result = updatedRecords.reduce((map: { [nodeId: string]: FamilyMemberData }, curr: any) => ({ ...map, [curr.node_id]: curr }), {});

  return result;//includes both new and existing records
};
//#endregion

//#region deleteTree
export const deleteTree = async (treeId: number): Promise<ServiceResponseWithPayload<null>> => {
  let response: ServiceResponseWithPayload<null> = { code: 500, error: true, payload: null };
  const tree = await FamilyTree.findByPk(treeId);

  if (!tree) {
    logger.error('Tree does not exist. Cannot delete', { treeId });
  } else {
    await tree.destroy();
    response = {
      ...response, code: 200, error: false
    };
  }

  return response;
};
//#endregion

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

//#region generateTreeMembersRecords
/**
 * ? Goes through all the family members submitted, creates records for each
 * ? is ignored if any of those memeber already has a record since this is part of the initial create action
 * @param members 
 * @param userId 
 */
const generateTreeMembersRecords = async (members: FamilyMemberData[] = [], userId: number): Promise<MappedFamilyMembers | null> => {
  logger.info("START GENERATION ", members)
  const today = dayjs();
  const newMemberGroup: any[] = [];
  const nodeIdList = members.map(m => m.node_id);
  //? using the native query rather than the helper function, I need the ability to update later on 
  const duplicateRecords = await FamilyMember.findAll({ where: { node_id: { [Op.in]: nodeIdList } } });
  logger.info('Checking for duplicate family member before creating tree ', { duplicateRecords, nodeIdList });

  for (const m of members) {
    const currentMemberIsDuplicate = !!duplicateRecords?.find((r: FamilyMember) => r.dataValues.node_id === m.node_id);
    logger.info('member in list ', m);
    if (currentMemberIsDuplicate) {
      continue;
    } else {
      newMemberGroup.push({
        ...m,
        age: today.diff(dayjs(m.dob), 'years'),
        description: m?.description || '',
        created_by: userId,
        position: JSON.stringify({x: 0, y:0}),
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
    const newMembersMap: MappedFamilyMembers = newRecords.reduce((map: { [nodeId: string]: FamilyMemberData }, currentMember: FamilyMember) => {
      const currentMemberData = formatFamilyMemberToFront(currentMember)
      return ({ ...map, [currentMember.dataValues.node_id]: currentMemberData });
    }, {});
    return newMembersMap;
  } else {
    logger.error('Unable to bulk create members, no records created');
  }

  return null;
};
//#endregion

//#region bulkUpdateRecordsPosition
/**
 * @param nodeIds 
 * @param membersList 
 * @param initialPosition 
 * @param relation 
 * @param anchor 
 */
const bulkUpdateRecordsPosition = async (nodeIds: string[] = [], membersList: FamilyMemberData[], initialPosition: { x: number, y: number }, relation: KinshipEnum, anchor: string): Promise<FamilyMemberData[]> => {
  const result: FamilyMemberData[] = [];

  if (Array.isArray(nodeIds)) {
    await Promise.all(nodeIds.map(async (nodeId: string, nodeIndex: number) => {
      logger.info('Processing member inside the promise all bulk update: ', { nodeIds, membersList, nodeId, nodeIndex, relation });
      const existingRecordForRelative = membersList.find((m: FamilyMemberData) => m.node_id === nodeId);
      let offset = { x: 0, y: 0 };

      // calculate the offset in the graphic tree based on kinship
      switch (relation) {
        case KinshipEnum.child:
          offset = { x: initialPosition.x + (125 * nodeIndex), y: initialPosition.y + 125 }
          break;
        case KinshipEnum.sibling:
          offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y }
          break;
        case KinshipEnum.spouse:
          offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y };
          break;
        case KinshipEnum.parent:
          offset = { x: initialPosition.x + (125 * nodeIndex), y: initialPosition.y - 125 };
          break;
      }

      logger.info('Offset based on current relation ', { offset, relation });
      // update record of current relative with the offset
      if (existingRecordForRelative) { //previous version would check if duplicate in an array. see memberwithcoords in commented code
        const relativeUpdated = await FamilyMember.update({
          position: JSON.stringify(offset),
          connections: JSON.stringify([{
            id: `${anchor}-${existingRecordForRelative.node_id}`,
            source: anchor,
            target: existingRecordForRelative.node_id
          }])
        }, { where: { node_id: { [Op.eq]: existingRecordForRelative.node_id } } });

        if (relativeUpdated?.[0] && relativeUpdated?.[0] === 1) {
          // if update was successful, add the offset to the raw, formatted object and add to list for return
          result.push({ ...existingRecordForRelative, position: offset });
        }
      } else {
        logger.info('ignoring current child as it is a dupe, ', { relative: nodeId });
      }

      result.push(); //don't update array if nothing available. avoid no return statement error
    }));
  } else {
    logger.info('NODE IDS ARE NOT OF TYPE ARRAY ', { nodeIds, membersList });
  }

  logger.info('Result after all positions updates', result);
  return result;
};
//#endregion

const formatFamilyMemberToFront = (member: FamilyMember): FamilyMemberData => ({
  ...member.dataValues,
  type: 'custom',
  children: JSON.parse(member?.children?.length ? member?.children : '[]'),
  siblings: JSON.parse(member?.siblings?.length ? member?.siblings : '[]'),
  spouses: JSON.parse(member?.spouses?.length ? member?.spouses : '[]'),
  parents: JSON.parse(member?.parents?.length ? member?.parents : '[]'),
  position: JSON.parse(member?.position || '{}'),
  connections: JSON.parse(member?.connections || '[]')
});

/**
 * ? For each member of a family tree,
 * ? populate all the relatives array with their actual data from db, not just node_id
 * @param treeId number
 * @returns 
 */
export const getAllRelativesData = async (treeRecord: FamilyTree | void): Promise<FamilyMemberData[] | null> => {
  const relativesData: any = [];

  try {
    logger.info('The Tree ', { treeRecord });
    if (treeRecord?.dataValues) {
      const nodeIds: string[] = JSON.parse(treeRecord.dataValues?.members || '[]');
      logger.info("current Tree's members", { treeMembers: nodeIds });

      await Promise.all(nodeIds.map(async (m) => {
        const memberRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: m } } });
        logger.info('Found tree member record', { memberRecord });
        if (memberRecord) {
          const formattedRecord = formatFamilyMemberToFront(memberRecord);
          relativesData.push(formattedRecord);
        }
      }));

    } else {
      logger.error('Invalid entry for tree record ', treeRecord);
      return null;
    }

  } catch (e: unknown) {
    logger.error('FAILED getting relatives', e);
    return null;
  }

  return relativesData;
};