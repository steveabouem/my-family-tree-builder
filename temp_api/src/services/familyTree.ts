import dayjs from "dayjs";
import { InferAttributes, Op } from "sequelize";
import FamilyTree from "../models/FamilyTree";
import {
  FamilyTreeFormData, APIGetFamilyTreeResponse,
  APIRequestPayload, FamilyMemberData, ManageTreeAPIResponse, ManageTreeRequestPayload,
  ServiceResponseWithPayload,
  ManageMembersRequestPayload,
  DeleteMembersRequestPayload,
  DeleteTreeRequestPayload
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
        const memberRecords: FamilyMember[] = await FamilyMember.findAll({ where: { node_id: { [Op.in]: JSON.parse(t.members) } } });
        // @ts-ignore: I dont feel like fixing this. Its a simple fix, but I dont feel like it rn
        t.members = memberRecords?.map(m => formatFamilyMemberToFront(m));
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
// create was once again returning an empty arrayBuffer. I had mistyped the members arg.
// need to make sure to always extract the actual attributes. By creataing actualMemberDataList
// I bypassed the error for create, but I need to cleanup and ideally avoid the workaroud.
// it should be clearer  what goes in and what comes out and ideally the same for create and update
export const positionFamilyMembers = async (members: any[], anchorNodeId: string): Promise<FamilyMemberData[]> => {
  // TODO: review crud and decide on FamilyMember[] and InferAttributes<FamilyMember>[]
  const actualMemberDataList = members.map(m => m?.dataValues || m)
  const membersWithCoords: FamilyMemberData[] = [];
  let anchor = actualMemberDataList.find(m => m.node_id === anchorNodeId);
  logger.info('FOUND ANCHOR ', { anchor, actualMemberDataList })
  // go through  the anchor and its relative, and update the positions based on the anchor's position. make sure to use existing position if already available
  if (anchor) {
    // Always fetch anchor's position from database to ensure we have the latest value
    // This is important because updateTreeMembers may have preserved the existing position
    const anchorRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: anchorNodeId } } });
    let anchorPosition = { x: 0, y: 0 };
    if (anchorRecord) {
      const formattedAnchor = formatFamilyMemberToFront(anchorRecord);
      anchorPosition = formattedAnchor.position || { x: 0, y: 0 };
      // Update anchor object with position from database
      anchor = { ...anchor, position: anchorPosition };
    } else if (anchor.position) {
      // Fallback to anchor's position if DB record not found
      anchorPosition = anchor.position;
    }
    logger.info('Anchor data is ', { anchor, anchorPosition })
    // position every one of the anchor's relatives
    const position = anchorPosition;
    const childrenNodeIds: string[] = anchor?.children || [];
    const siblingsNodeIds: string[] = anchor?.siblings || [];
    const spousesNodeIds: string[] = anchor?.spouses || [];
    const parentsNodeIds: string[] = anchor?.parents || [];
    const childrenList = await bulkUpdateRecordsPosition(childrenNodeIds, actualMemberDataList, position, KinshipEnum.child, anchorNodeId);
    const siblingsList = await bulkUpdateRecordsPosition(siblingsNodeIds, actualMemberDataList, position, KinshipEnum.sibling, anchorNodeId);
    const parentsList = await bulkUpdateRecordsPosition(parentsNodeIds, actualMemberDataList, position, KinshipEnum.parent, anchorNodeId);
    const spousesList = await bulkUpdateRecordsPosition(spousesNodeIds, actualMemberDataList, position, KinshipEnum.spouse, anchorNodeId);

    // add them all to the list of members
    membersWithCoords.push(...childrenList);
    membersWithCoords.push(...siblingsList);
    membersWithCoords.push(...parentsList);
    membersWithCoords.push(...spousesList);
    // once thats done, position the current member themselves
    // Update anchor's position in database (it may have been preserved from existing record)
    await FamilyMember.update(
      { position: JSON.stringify(position) },
      { where: { node_id: { [Op.eq]: anchorNodeId } } }
    );
    membersWithCoords.push({
      ...anchor,
      type: 'custom',
      position // position is already set from database fetch above
      // name: `${anchor.first_name} ${anchor.last_name}`
    });

    logger.info('newNodeState', membersWithCoords);
    return membersWithCoords;
  } else {
    logger.error('No anchor provided. ', actualMemberDataList);
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
      const memberRecords: FamilyMember[] = await FamilyMember.findAll({ where: { node_id: { [Op.in]: JSON.parse(tree.members) } } });
      // @ts-ignore: I dont feel like fixing this. Its a simple fix, but I dont feel like it rn
      tree.members = memberRecords?.map(m => formatFamilyMemberToFront(m));
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

  if (data?.treeId) {
    try {
      const tree = await FamilyTree.findByPk(data.treeId);
      logger.info('Tree and incoming updates: ', { tree, updateData });

      if (!tree?.dataValues?.id) {
        logger.error('Invalid entries ', data);
      } else {
        // ! only the members passed by the form will be here. 
        // ! If the tree already had existing members and they're not being updated, they wont be in this variable
        const updatedMembersRecords = await updateTreeMembers(tree, userId, data);
        logger.info('updateTree: updatedMembersRecords from updateTreeMembers', { updatedMembersRecords, keys: Object.keys(updatedMembersRecords || {}) });
        const withCoords = await positionFamilyMembers(Object.values(updatedMembersRecords || {}), data.anchor);
        logger.info('updateTree: with coords ', { withCoords });
        // ! in order to have all the records sent back to the user, query all the tree members before updating the positions
        const prevNodeIds = JSON.parse(tree.dataValues.members);
        logger.info('Members list before tree update with new positions ', { prevNodeIds });
        const incomingnodeIdList = data.members.map(m => m.node_id);

        incomingnodeIdList.forEach((n: string) => {
          if (!prevNodeIds.includes(n)) {
            logger.info('This node id is new: ', { n })
            prevNodeIds.push(n);
          } else {
            logger.info('This node id already existed: ', { n })
          }
        });

        logger.info('full node list', { prevNodeIds });
        const emailList = withCoords.map((curr) => curr.email);
        logger.info('withcoords', withCoords)
        const updatedTree = await tree.update({
          ...updateData,
          members: JSON.stringify(prevNodeIds),
          emails: JSON.stringify(emailList),
        });

        const updatedMembers = await FamilyMember.findAll({
          where: {
            node_id: {
              [Op.in]: prevNodeIds
            }
          }
        });
        const membersFormatted = updatedMembers.map((m: FamilyMember) => formatFamilyMemberToFront(m));
        logger.info('members at the end: ', { updatedMembers, membersFormatted });// ! CURRENT FOCUS: THIS SEEMS TO HAVE ALL THE MEMBERS UP TO DATE (tried with 2)
        response.payload = { ...updatedTree.dataValues, members: membersFormatted };
        response.error = false;
        response.code = 200;
      }
    } catch (e: unknown) {
      logger.error('Unable to update tree ', e);
    }
  } else {
    response.message = 'No id provided';
  }
  return response;
};
//#endregion

/**
 * 
 * @param tree : includes list of members as currently stored in db
 * @param userId 
 * @param updateData: member and tree updates (including both new and existing members)
 */
//#region updateTreeMembers
// TODO: there are more validations to be done here.
const updateTreeMembers = async (tree: FamilyTree, userId: number, updateData: FamilyTreeFormData):
  Promise<{ [id: string]: FamilyMemberData } | null> => {
  const existingMembersNodeIds = JSON.parse(tree.members);
  const recordsFormattedAndUpdated: FamilyMemberData[] = [];
  let newMembersFormData: Partial<FamilyMember>[] = [];
  let membersRecordsCreated: FamilyMember[] = [];
  let existingMembersFormData: Partial<InferAttributes<FamilyMember>>[] = [];
  const today = dayjs();

  logger.info('updateTreeMembers: Tree members array', { existingMembersNodeIds });
  logger.info('updateTreeMembers: All incoming members', { allMembers: updateData.members });


  // prepare update of incoming basic attributes (positionning is done separately for now)
  for (const m of updateData.members) {
    if (tree.members.includes(m.node_id)) {
      existingMembersFormData.push({
        ...m,
        description: m?.description || '',
        // Don't stringify position here - it will be handled by positionFamilyMembers
        // Only stringify if position is explicitly provided, otherwise preserve existing
        position: m.position ? JSON.stringify(m.position) : undefined,
        connections: JSON.stringify(m.connections || []),
        parents: JSON.stringify(Array.isArray(m.parents) ? m.parents : (m.parents ? [m.parents] : [])),
        spouses: JSON.stringify(Array.isArray(m.spouses) ? m.spouses : (m.spouses ? [m.spouses] : [])),
        siblings: JSON.stringify(Array.isArray(m.siblings) ? m.siblings : (m.siblings ? [m.siblings] : [])),
        children: JSON.stringify(Array.isArray(m.children) ? m.children : (m.children ? [m.children] : [])),
      });
    } else {
      newMembersFormData.push({
        ...m,
        age: today.diff(dayjs(m.dob), 'years'),
        description: m?.description || '',
        created_by: userId,
        position: JSON.stringify(m.position || { x: 0, y: 0 }),
        connections: JSON.stringify(m.connections || []),
        parents: JSON.stringify(Array.isArray(m.parents) ? m.parents : (m.parents ? [m.parents] : [])),
        spouses: JSON.stringify(Array.isArray(m.spouses) ? m.spouses : (m.spouses ? [m.spouses] : [])),
        siblings: JSON.stringify(Array.isArray(m.siblings) ? m.siblings : (m.siblings ? [m.siblings] : [])),
        children: JSON.stringify(Array.isArray(m.children) ? m.children : (m.children ? [m.children] : [])),
      });
    }

    // create records for any family member that doesnt already have one. 
    if (newMembersFormData.length) {
      logger.info("updateTreeMembers: Ready for bulk create: ", { newRecords: newMembersFormData });
      // @ts-ignore
      membersRecordsCreated = await FamilyMember.bulkCreate(newMembersFormData);
      // Add formatted new records to the result
      membersRecordsCreated.forEach((member: FamilyMember) => {
        const formattedRecord = formatFamilyMemberToFront(member);
        recordsFormattedAndUpdated.push(formattedRecord);
      });
    }

    // update records for any family member that already has one. 
    if (existingMembersFormData.length) {
      logger.info("updateTreeMembers: Ready for bulk update]: ", { newRecords: membersRecordsCreated })

      await Promise.all(existingMembersFormData.map(async (memberData) => {
        const existingMemberRecord = await FamilyMember.findOne({
          where: {
            node_id: { [Op.eq]: memberData.node_id }
          }
        });

        if (existingMemberRecord) {
          logger.info('Found record for existing member in list. REady for single update', { existingMemberRecord });
          const updatedRecord = await existingMemberRecord.update({
            ...existingMemberRecord.dataValues,
            ...memberData,
            age: existingMemberRecord.dataValues.age,
            // Update JSON fields if provided - memberData already contains stringified values from existingMembersFormData
            // Preserve existing position if not explicitly provided (positioning will be handled by positionFamilyMembers)
            position: memberData.position ?? existingMemberRecord.dataValues.position,
            connections: memberData.connections || existingMemberRecord.dataValues.connections,
            children: memberData.children || existingMemberRecord.dataValues.children,
            parents: memberData.parents || existingMemberRecord.dataValues.parents,
            siblings: memberData.siblings || existingMemberRecord.dataValues.siblings,
            spouses: memberData.spouses || existingMemberRecord.dataValues.spouses,
          });
          // Add formatted record to the result
          const formattedRecord = formatFamilyMemberToFront(updatedRecord);
          recordsFormattedAndUpdated.push(formattedRecord);
        } else {
          logger.info('NOT FOUND EXISTING MEMBER')
        }
      }));
    }
  };
  const result = recordsFormattedAndUpdated.reduce((map: { [nodeId: string]: FamilyMemberData }, curr: any) => ({ ...map, [curr.node_id]: curr }), {});
  logger.info('updateTreeMembers: Final result object', { result, resultKeys: Object.keys(result) });

  return result;//includes both new and existing records
  //#endregion
};

/**
 * 
 */
export const deleteTreeMember = async (data: DeleteMembersRequestPayload): ManageTreeAPIResponse => {
  let response: ServiceResponseWithPayload<any | null> = { code: 500, error: true, payload: null };

  try {
    const currentMember = await FamilyMember.findOne({ where: { node_id: data.node_id } });
    const matchingTree = await FamilyTree.findByPk(data.treeId);
    logger.info('vars', { currentMember, matchingTree });
    
    if (currentMember && matchingTree) {
      const nodes: string[] = JSON.parse(matchingTree.dataValues.members);
      const memberIndex = nodes.indexOf(currentMember.node_id);
      const updatedNodes = nodes.filter(n => n != currentMember.node_id);
      logger.info('DELETE M: ', { nodes, memberIndex, updatedNodes });
      // nodes.splice(memberIndex, 1);
      const done = await matchingTree.update('members', JSON.stringify(updatedNodes));
      logger.info('DELETE M: after splice', { nodes, matchingTree, done });
      
      await currentMember.destroy();
      response.payload = { ...done.dataValues, members: JSON.parse(done.dataValues.members) };
      response.code = 200;
      response.error = false;
    }
  } catch (e: unknown) {
    logger.error('Delete member failed: ', { error: e })
    response.message = 'Invalid member';
  }

  return response;
};

//#region update positions
/**
 * Used to save family members new positions (single or in bulk alike)
 * @param members 
 * @param userId 
 */
export const updateMemberPositions = async (positions: ManageMembersRequestPayload) => {
  // TODO: return entire list of members to refresh the tree in the front
  let response: ServiceResponseWithPayload<any | null> = { code: 500, error: true, payload: null };

  try {
    if (positions.userId) {
      const nodeIds = positions.data.map(m => m.node_id);
      const memberRecords = await FamilyMember.findAll({
        where: {
          node_id: {
            [Op.in]: nodeIds
          }
        }
      });

      if (memberRecords?.length) {
        await Promise.all(memberRecords.map(m => {
          const newCoords = positions.data.find(p => p.node_id === m.node_id);
          m.position = JSON.stringify(newCoords?.new_position);
          m.save();
        }));
      }
      response.payload = memberRecords;
      response.code = 200;
      response.error = false;
    } else {
      response.message = 'Invalid entry';
    }
  } catch (e: unknown) {
    response.message = 'Failed operation';
  }
  return response;
};
//#endregion

//#region deleteTree
export const deleteTree = async (data: DeleteTreeRequestPayload ): Promise<ServiceResponseWithPayload<null>> => {
  let response: ServiceResponseWithPayload<null> = { code: 500, error: true, payload: null };
  logger.info('payload ', {data})
  try {
    const tree = await FamilyTree.findByPk(data.id);
    const user = await User.findByPk(data.userId);
    const isAllowed = !!tree?.dataValues && tree.dataValues.created_by == user?.id;

    if (isAllowed) {
      await tree.destroy();
      response = {
        ...response, code: 200, error: false
      };
    } else {
      logger.error('updateTreeMembers: Invalid delete entries');
    }
  } catch(e: unknown) {
    logger.error('Delete tree, ', {e});
  }

  return response;
};
//#endregion

// TODO: you need to separate the action of updating a single member's data with the action of adding relatives to a member.
//  This is to avoir always running an update on the members records even when all youre doing is adding relatives to it. make sure to also make that distinction in the frontend's CTAs
// export const updateSingleMemberData = (memberDAta: FamilyTreeFormData, memberId: number)

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
const generateTreeMembersRecords = async (members: FamilyMemberData[] = [], userId: number): Promise<{ [key: string]: FamilyMemberData } | null> => {
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
        position: JSON.stringify({ x: 0, y: 0 }),
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
    const newMembersMap: { [key: string]: FamilyMemberData } = newRecords.reduce((map: { [nodeId: string]: FamilyMemberData }, currentMember: FamilyMember) => {
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
const bulkUpdateRecordsPosition = async (
  nodeIds: string[] = [], membersList: FamilyMemberData[], initialPosition: { x: number, y: number },
  relation: KinshipEnum, anchor: string
): Promise<FamilyMemberData[]> => {
  const result: FamilyMemberData[] = [];
  //! TODO: URGENT instead of creating/getUnpackedSettings, then make another operation for SVGTextPositioningElement, you should 
  // manage the incomning data object for each membersList, use the position function to assign a x and yield, and only then create/ updte the record

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

const formatFamilyMemberToFront = (member: FamilyMember): FamilyMemberData => {
  logger.info('formatFamilyMemberToFront: shape of a member', { member, pos: member.position, s: member.siblings });
  //! member could be coming from a create or update operation. sequelize returns with datavalues in one case, and the direct object in the other
  const memberObject = member?.dataValues || member;

  return ({
    ...memberObject,
    type: 'custom',
    children: JSON.parse(member?.children?.length > 0 ? member?.children : '[]'),
    siblings: JSON.parse(member?.siblings?.length > 0 ? member?.siblings : '[]'),
    spouses: JSON.parse(member?.spouses?.length > 0 ? member?.spouses : '[]'),
    parents: JSON.parse(member?.parents?.length > 0 ? member?.parents : '[]'),
    position: JSON.parse(member?.position || '{x: 0, y: 0}'),
    connections: JSON.parse(member?.connections || '[]')
  });
}

/**
 * ? For each member of a family tree,
 * ? populate all the relatives array with their actual data from db, not just node_id
 * @param treeId number
 * @returns 
 */
export const getAllRelativesData = async (treeRecord: FamilyTree | void): Promise<FamilyMemberData[] | null> => {
  const relativesData: FamilyMemberData[] = [];

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