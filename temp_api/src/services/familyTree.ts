import FamilyTree from "../models/FamilyTree";
import {
  FamilyTreeFormData, APIGetFamilyTreeResponse,
  APIRequestPayload, FamilyMemberData, ManageTreeAPIResponse, ManageTreeRequestPayload,
  ServiceResponseWithPayload,
  ManageMembersRequestPayload,
  DeleteMembersRequestPayload,
  DeleteTreeRequestPayload,
  CreateTreeRequestV2,
  FamilyMemberFormValuesV2,
  CreateTreeResponseV2,
  RelationshipMapping,
  MemberVisibility,
} from "./types";
import logger from "../utils/logger";
import { User, Collaborator, FamilyMember, Relationship } from "../models";
import { extractSingleDataValuesFrom, processIncomingImage, processOutgoingImage } from "./serviceHelpers";
import { Kinship } from "./types";
import db from '../../db'
import { Op } from "sequelize";
import { associationAliases } from "../associations";

//#region getAllTrees
export const getAllTrees = async (id: number): Promise<ServiceResponseWithPayload<FamilyTree[]>> => {
  let response: APIRequestPayload<FamilyTree[]> = { code: 500, error: true, payload: [] };
  let treeList: FamilyTree[] = [];

  try {
    const userRecord: User | null = await User.findByPk(id);
    logger.info('Curr user ', { userRecord: userRecord?.email });

    if (userRecord) {
      treeList = await FamilyTree.findAll({
        where: {
          created_by_id: id
        },
        include: [
          {
            model: User,
            as: associationAliases.treeUser,
            where: { id },
            required: false
          },
          {
            model: Collaborator,
            as: associationAliases.treeCollaborators,
            where: { user_id: id },
            required: false
          },
          {
            model: FamilyMember,
            as: associationAliases.treeMembers,
            where: {
              [Op.or]: [
                { user_id: id },
                { email: userRecord.email }
              ]
            },
            required: false
          }
        ],
        subQuery: false //? avoid dupes
      });

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

//#region createTree
/**
 * ? used to create a record for each and to build the members array in the new tree instance
 * @param createData : form values for tree and its desired members.
 * @returns FamilyTree
 */

export const createTreeV2 = async (createData: CreateTreeRequestV2): Promise<ServiceResponseWithPayload<CreateTreeResponseV2 | null>> => {
  logger.info("START TREE GENERATION ", createData);
  const incomingListOfMembers = Object.values(createData.members);
  const response: APIRequestPayload<CreateTreeResponseV2> = {
    code: 500,
    error: true,
    payload: { tree: null, members: [], connections: [] }
  };

  try {
    /** -----------------------------------------------
    *? 1. Create the tree (fast, single insert)
    * -----------------------------------------------
    */
    const selectedAnchor = incomingListOfMembers.find(m => m.is_anchor);
    const newTree = await FamilyTree.create({
      ...createData,
      default_anchor_family_member_id: null
    })
      .catch((e: unknown) => {
        logger.error('Failed? ', { e })
      });

    if (!newTree?.id) {
      throw new Error('Tree creation failed');
    }

    response.payload.tree = newTree;

    /** -----------------------------------------------
    *? 2. Preprocess members + relationship mappings (OUTSIDE transaction)
    * -----------------------------------------------
    */
    const relationBuckets = {
      parents: [] as RelationshipMapping[],
      siblings: [] as RelationshipMapping[],
      spouses: [] as RelationshipMapping[]
    };

    const memberPayloads = incomingListOfMembers.map(m => {
        logger.info('Go through member relationships', {m })
      
      // Collect relationship mappings
      if (m.parents?.length) {
        logger.info('Has parents ', {count :m.parents.length})

        relationBuckets.parents.push(
          ...m.parents.map(pid => ({
            type: Kinship.parent,
            tree_id: newTree.id,
            sourceNodeId: m.node_id,
            targetNodeId: pid
          }))
        );
      }
      
      if (m.siblings?.length) {
        logger.info('Has siblings ', {count :m.siblings.length})
        relationBuckets.siblings.push(
          ...m.siblings.map(sid => ({
            type: Kinship.sibling,
            tree_id: newTree.id,
            sourceNodeId: m.node_id,
            targetNodeId: sid
          }))
        );
      }

      if (m.spouses?.length) {
        logger.info('Has spouses ', {count :m.spouses.length})
        relationBuckets.spouses.push(
          ...m.spouses.map(sid => ({
            type: Kinship.spouse,
            tree_id: newTree.id,
            sourceNodeId: m.node_id,
            targetNodeId: sid
          }))
        );
      }
      logger.info('Relationship buckets ready for DB injection', { relationBuckets })
      // Build FamilyMember payload
      return {
        tree_id: newTree.id,
        node_id: m.node_id,
        first_name: m.first_name,
        last_name: m.last_name,
        gender: m.gender,
        dob: m.dob,
        email: m.email || null,
        user_id: m.user_id || null,
        verified_by_user: false,
        created_by_id: createData.created_by_id,
        description: m?.description || null,
        deceased: !!m?.deceased,
        dod: m?.dod || null,
        visibility: m?.visibility || MemberVisibility.family_only,
        occupation: m?.occupation || null,
        marital_status: m?.marital_status || null,
        profile_url: m?.profile_url || null
      };
    });

    /** -----------------------------------------------
    *? 3. Transaction: bulk insert members + relationships. 
    * -----------------------------------------------
    */
    await db.transaction(async (t) => {
      const membersRecords = await FamilyMember.bulkCreate(memberPayloads, {
        transaction: t,
        returning: true
      });
      response.payload.members = membersRecords;

      //? Using Map here for improved performance. 
      //? array.map was used previously, and took over 10 secs to fulfill
      const idMap = new Map(
        membersRecords.map(m => [m.node_id, m.id])
      );


      const relationshipPayloads: Array<{
        tree_id: number;
        source_family_member_id: number;
        target_family_member_id: number;
        type: Kinship;
      }> = [];

      const addNodeIdsToRelationshipBuckets = (bucket: RelationshipMapping[], type: Kinship) => {
        for (const r of bucket) {
          relationshipPayloads.push({
            tree_id: r.tree_id,
            source_family_member_id: idMap.get(r.sourceNodeId)!,
            target_family_member_id: idMap.get(r.targetNodeId)!,
            type
          });
        }
      };

      addNodeIdsToRelationshipBuckets(relationBuckets.parents, Kinship.parent);
      addNodeIdsToRelationshipBuckets(relationBuckets.siblings, Kinship.sibling);
      addNodeIdsToRelationshipBuckets(relationBuckets.spouses, Kinship.spouse);

      if (relationshipPayloads.length > 0) {
        const relationshipRecords = await Relationship.bulkCreate(relationshipPayloads, {
          transaction: t
        });

        response.payload.connections = relationshipRecords;
      }

      if (selectedAnchor) {
        const anchorId = idMap.get(selectedAnchor.node_id);
        logger.info("Tree's anchor provided", { anchorId });

        if (anchorId) {
          await newTree.update(
            { default_anchor_family_member_id: anchorId },
            { transaction: t }
          );
        }
      }

      response.code = 200;
      response.error = false;
    });
  } catch (e) {
    logger.error('Failed to create tree', { e });
  }

  return response;
};
//#endregion

//#region getTreeById
export const getTreeById = async (id: number): Promise<ServiceResponseWithPayload<CreateTreeResponseV2 | null>> => {
  let response: ServiceResponseWithPayload<CreateTreeResponseV2 | null> = { code: 500, error: true, payload: null };

  try {
    if (!Number.isFinite(id) || id <= 0) {
      response.code = 400;
      response.message = 'Invalid tree id';

      return response;
    }

    const tree = await FamilyTree.findByPk(id);
    if (!tree) {
      response.code = 404;
      response.message = 'Tree not found';

      return response;
    }
    // transaction with include flag was not returning in time. Using simpler promise all
    const [members, connections, collaborators] = await Promise.all([
      FamilyMember.findAll({ where: { tree_id: id } }),
      Relationship.findAll({ where: { tree_id: id } }),
      Collaborator.findAll({ where: { tree_id: id } }),
    ]);

    logger.info('USER TREE DETAILS', { treeId: id, members: members.length, connections: connections.length });

    response.code = 200;
    response.error = false;
    response.message = 'Family tree fetched successfully';
    response.payload = { tree, members, connections, collaborators };

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


  return null;//includes both new and existing records
  //#endregion
};

/**
 * 
 */
export const deleteTreeMember = async (data: DeleteMembersRequestPayload): ManageTreeAPIResponse => {
  let response: ServiceResponseWithPayload<any | null> = { code: 500, error: true, payload: null };

  // try {
  //   const currentMember = await FamilyMember.findOne({ where: { node_id: data.node_id } });
  //   const matchingTree = await FamilyTree.findByPk(data.treeId);
  //   logger.info('vars', { currentMember, matchingTree });

  //   if (currentMember && matchingTree) {
  //     const nodes: string[] = JSON.parse(matchingTree.dataValues.members);
  //     const memberIndex = nodes.indexOf(currentMember.node_id);
  //     const updatedNodes = nodes.filter(n => n != currentMember.node_id);
  //     logger.info('DELETE M: ', { nodes, memberIndex, updatedNodes });
  //     // nodes.splice(memberIndex, 1);
  //     const done = await matchingTree.update('members', JSON.stringify(updatedNodes));
  //     logger.info('DELETE M: after splice', { nodes, matchingTree, done });

  //     await currentMember.destroy();
  //     response.payload = { ...done.dataValues, members: JSON.parse(done.dataValues.members) };
  //     response.code = 200;
  //     response.error = false;
  //   }
  // } catch (e: unknown) {
  //   logger.error('Delete member failed: ', { error: e })
  //   response.message = 'Invalid member';
  // }

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

  // try {
  //   if (positions.userId) {
  //     const nodeIds = positions.data.map(m => m.node_id);
  //     const memberRecords = await FamilyMember.findAll({
  //       where: {
  //         node_id: {
  //           [Op.in]: nodeIds
  //         }
  //       }
  //     });

  //     if (memberRecords?.length) {
  //       await Promise.all(memberRecords.map(m => {
  //         const newCoords = positions.data.find(p => p.node_id === m.node_id);
  //         m.position = JSON.stringify(newCoords?.new_position);
  //         m.save();
  //       }));
  //     }
  //     response.payload = memberRecords;
  //     response.code = 200;
  //     response.error = false;
  //   } else {
  //     response.message = 'Invalid entry';
  //   }
  // } catch (e: unknown) {
  //   response.message = 'Failed operation';
  // }
  return response;
};
//#endregion

//#region deleteTree
export const deleteTree = async (data: DeleteTreeRequestPayload): Promise<ServiceResponseWithPayload<null>> => {
  let response: ServiceResponseWithPayload<null> = { code: 500, error: true, payload: null };
  logger.info('payload ', { data })
  try {
    const tree = await FamilyTree.findByPk(data.id);
    const user = await User.findByPk(data.userId);
    const isAllowed = !!tree?.dataValues && tree.dataValues.created_by_id == user?.id;

    if (isAllowed) {
      await tree.destroy();
      response = {
        ...response, code: 200, error: false
      };
    } else {
      logger.error('updateTreeMembers: Invalid delete entries');
    }
  } catch (e: unknown) {
    logger.error('Delete tree, ', { e });
  }

  return response;
};
//#endregion