import FamilyTree from "../models/FamilyTree";
import {
  FamilyTreeFormData, APIRequestPayload, FamilyMemberData, ManageTreeAPIResponse, ManageTreeRequestPayload,
  ServiceResponseWithPayload, CreateTreeRequestV2, CreateTreeResponseV2, RelationshipMapping, MemberVisibility,
  TreeLayout, LayoutNode, LayoutEdge,
} from "./types";
import logger from "../utils/logger";
import { User, Collaborator, FamilyMember, Relationship } from "../models";
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

//#region buildLayoutNodes
const NODE_TYPES = {
  customNode: 'customNode',
  relationNode: 'relationNode',
  generationLayer: 'generationLayer',
  customEdge: 'customEdge',
  spouseEdge: 'spouseEdge',
  siblingEdge: 'siblingEdge',
} as const;

const LAYOUT_OFFSET = {
  treeNodeOffsetX: 125,
  treeNodeOffsetY: 225,
  spouseGapX: 180,
  siblingGapX: 200,
};

function buildLayoutNodes(
  members: FamilyMember[],
  connections: Relationship[],
  anchorId: number | null,
): TreeLayout {
  const membersMap = new Map(members.map(m => [m.id, m]));

  const rootId = anchorId != null && membersMap.has(anchorId)
    ? anchorId
    : members[0]?.id ?? null;

  if (rootId == null) return { nodes: [], edges: [] };

  // Group children by shared parent set into family units
  const childToParents = new Map<number, Set<number>>();
  for (const c of connections) {
    if (c.type !== Kinship.parent) continue;
    const childId = Number(c.source_family_member_id);
    const parentId = Number(c.target_family_member_id);
    if (!childToParents.has(childId)) childToParents.set(childId, new Set());
    childToParents.get(childId)!.add(parentId);
  }
  const familyUnits = new Map<string, { parentIds: number[]; childIds: number[] }>();
  for (const [childId, parentSet] of childToParents) {
    const sortedParents = [...parentSet].sort((a, b) => a - b);
    const key = sortedParents.join('-');
    if (!familyUnits.has(key)) familyUnits.set(key, { parentIds: sortedParents, childIds: [] });
    familyUnits.get(key)!.childIds.push(childId);
  }

  const coordsMap = new Map<number, { x: number; y: number }>();
  const nodes: LayoutNode[] = [];
  const childSlot = new Map<number, number>();

  const placeNode = (id: number, pos: { x: number; y: number }) => {
    const m = membersMap.get(id);
    if (!m) return;
    coordsMap.set(id, pos);
    nodes.push({ id: String(id), type: NODE_TYPES.customNode, position: pos, data: { label: `${m.first_name} ${m.last_name}`, ...m.toJSON() }, draggable: true });
  };

  const assign = (neighborId: number, pos: { x: number; y: number }, q: { id: number; pos: { x: number; y: number } }[]) => {
    if (!membersMap.has(neighborId) || coordsMap.has(neighborId)) return;
    placeNode(neighborId, pos);
    q.push({ id: neighborId, pos });
  };

  placeNode(rootId, { x: 0, y: 0 });
  const queue: { id: number; pos: { x: number; y: number } }[] = [{ id: rootId, pos: { x: 0, y: 0 } }];

  while (queue.length) {
    const { id: cur, pos } = queue.shift()!;
    for (const c of connections) {
      const src = Number(c.source_family_member_id);
      const tgt = Number(c.target_family_member_id);
      const { treeNodeOffsetX, treeNodeOffsetY, spouseGapX, siblingGapX } = LAYOUT_OFFSET;

      if (c.type === Kinship.parent) {
        if (src === cur) assign(tgt, { x: pos.x, y: pos.y + treeNodeOffsetY }, queue);
        else if (tgt === cur) {
          const slot = childSlot.get(cur) ?? 0;
          assign(src, { x: pos.x + slot * (treeNodeOffsetX + 25), y: pos.y + treeNodeOffsetY }, queue);
          childSlot.set(cur, slot + 1);
        }
      } else if (c.type === Kinship.child) {
        if (src === cur) {
          const slot = childSlot.get(cur) ?? 0;
          childSlot.set(cur, slot + 1);
          assign(tgt, { x: pos.x + slot * 140, y: pos.y + 100 }, queue);
        } else if (tgt === cur) assign(src, { x: pos.x, y: pos.y - 100 }, queue);
      } else if (c.type === Kinship.sibling) {
        if (src === cur) assign(tgt, { x: pos.x + siblingGapX, y: pos.y }, queue);
        else if (tgt === cur) assign(src, { x: pos.x - siblingGapX, y: pos.y }, queue);
      } else if (c.type === Kinship.spouse) {
        if (src === cur) assign(tgt, { x: pos.x + spouseGapX, y: pos.y }, queue);
        else if (tgt === cur) assign(src, { x: pos.x - spouseGapX, y: pos.y }, queue);
      }
    }
  }

  let orphanCol = 0;
  for (const m of members) {
    if (coordsMap.has(m.id)) continue;
    placeNode(m.id, { x: orphanCol++ * 180, y: 80 - LAYOUT_OFFSET.treeNodeOffsetY });
  }

  // Real relationship edges between member nodes
  const edges: LayoutEdge[] = [];
  for (const c of connections) {
    edges.push({
      id: `${c.source_family_member_id}-${c.target_family_member_id}-${c.id}`,
      source: String(c.source_family_member_id),
      target: String(c.target_family_member_id),
      type: c.type === Kinship.sibling ? NODE_TYPES.spouseEdge
        : c.type === Kinship.spouse ? NODE_TYPES.siblingEdge
          : NODE_TYPES.customEdge,
    });
  }

  // Build PLI → CLN → GL chains and their edges per family unit
  for (const [key, unit] of familyUnits) {
    const parentPositions = unit.parentIds.map(id => coordsMap.get(id)).filter((p): p is { x: number; y: number } => p != null);
    const childPositions = unit.childIds.map(id => coordsMap.get(id)).filter((p): p is { x: number; y: number } => p != null);
    if (parentPositions.length === 0 || childPositions.length === 0) continue;

    const avg = (arr: { x: number; y: number }[], k: 'x' | 'y') => arr.reduce((s, p) => s + p[k], 0) / arr.length;
    const parentsAvgX = avg(parentPositions, 'x');
    const parentsAvgY = avg(parentPositions, 'y');
    const childrenAvgX = avg(childPositions, 'x');
    const childrenAvgY = avg(childPositions, 'y');
    const dir = parentsAvgY <= childrenAvgY ? 1 : -1;

    const pliPos = { x: parentsAvgX, y: parentsAvgY + dir * 55 };
    const clnPos = { x: parentsAvgX, y: pliPos.y + dir * 55 };
    const glPos = { x: childrenAvgX, y: childrenAvgY - dir * 40 };

    const pliId = `pli-${key}`;
    const clnId = `cln-${key}`;
    const glId = `gl-${key}`;

    const parentMembers = unit.parentIds.map(id => membersMap.get(id)).filter((m): m is FamilyMember => m != null);

    nodes.push(
      { id: pliId, type: NODE_TYPES.generationLayer, position: pliPos, data: { label: '' }, draggable: true },
      {
        id: clnId, type: NODE_TYPES.relationNode, position: clnPos, draggable: true,
        data: {
          label: `Children of ${parentMembers.map(m => m.first_name).join(' and ')}`,
          sources: parentMembers.map(m => ({ id: m.id, first_name: m.first_name, last_name: m.last_name })),
        },
      },
      { id: glId, type: NODE_TYPES.generationLayer, position: glPos, data: { label: '' }, draggable: true },
    );

    unit.parentIds.forEach(pid => {
      if (!coordsMap.has(pid)) return;
      edges.push({ id: `e-parent-pli-${pid}-${key}`, source: String(pid), target: pliId, type: NODE_TYPES.customEdge });
    });
    edges.push(
      { id: `e-pli-cln-${key}`, source: pliId, target: clnId, type: NODE_TYPES.customEdge },
      { id: `e-cln-gl-${key}`, source: clnId, target: glId, type: NODE_TYPES.customEdge },
    );
    unit.childIds.forEach(cid => {
      if (!coordsMap.has(cid)) return;
      edges.push({ id: `e-gl-child-${glId}-${cid}`, source: glId, target: String(cid), type: NODE_TYPES.customEdge });
    });
  }

  return { nodes, edges };
}
//#endregion

//#region createTree
/**
 * used to create a record for each and to build the members array in the new tree instance
 * @param createData : form values for tree and its desired members.
 * @returns FamilyTree
 */

export const createTreeV2 = async (createData: CreateTreeRequestV2): Promise<ServiceResponseWithPayload<CreateTreeResponseV2 | null>> => {
  const incomingListOfMembers = Object.values(createData.members);
  const response: APIRequestPayload<CreateTreeResponseV2> = {
    code: 500,
    error: true,
    payload: { tree: null, members: [], connections: [] }
  };
  let anchorMemberId: number | null = null;

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
      // Collect relationship mappings
      if (m.parents?.length) {
        logger.info('Has parents ', { count: m.parents.length })

        relationBuckets.parents.push(
          ...m.parents.map(pid => ({
            type: Kinship.parent,
            tree_id: newTree.id,
            targetNodeId: m.node_id,
            sourceNodeId: pid
          }))
        );
      }

      if (m.siblings?.length) {
        logger.info('Has siblings ', { count: m.siblings.length })
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
        logger.info('Has spouses ', { count: m.spouses.length })
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
          anchorMemberId = anchorId;
        }
      }

      response.code = 200;
      response.error = false;
    });

    if (response.code === 200) {
      response.payload.layout = buildLayoutNodes(
        response.payload.members,
        response.payload.connections,
        anchorMemberId,
      );
    }
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

    // Make a map of members
    // loop through connections and 
    logger.info('USER TREE DETAILS', { treeId: id, members: members.length, connections: connections.length });

    const layout = buildLayoutNodes(members, connections, tree.default_anchor_family_member_id ?? null);

    response.code = 200;
    response.error = false;
    response.message = 'Family tree fetched successfully';
    response.payload = { tree, members, connections, collaborators, layout };

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

//#region DELETE
export const deleteTree = async (data: {id: number, userId: number}): Promise<ServiceResponseWithPayload<null>> => {
  let response: ServiceResponseWithPayload<null> = { code: 500, error: true, payload: null };

  try {
    const tree = await FamilyTree.findByPk(data.id);
    const user = await User.findByPk(data.userId);
    const isAllowed = !!tree?.dataValues && tree.dataValues.created_by_id == user?.id;

    if (isAllowed) {
      await tree.update({active: false});
      response = {
        ...response, code: 200, error: false
      };
    } else {
      logger.error('Delete Tree: Invalid delete entries');
    }
  } catch (e: unknown) {
    logger.error('Delete tree, ', { e });
  }

  return response;
};
//#endregion

//#region DELETE ALL
export const deleteAll = async (payload: {list: number[], requester: number}) => {
  const {list, requester} = payload;
  const t = await db.transaction();

  try {
    const records = await FamilyTree.findAll({
      where: { id: { [Op.in]: list } },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    const isAllowed = !records.some(r => r.created_by_id !== requester);

    if (!isAllowed) {
      await t.rollback();
      return { code: 400, error: true, payload: null, message: 'Not allowed' };
    }

    await FamilyTree.update(
      { active: false },
      {
        where: {
          id: { [Op.in]: list },
          created_by_id: requester
        },
        transaction: t
      }
    );

    await t.commit();
    return { code: 200, error: false, payload: null };
  } catch (e) {
    await t.rollback();
    logger.error('Delete all trees, ', { e });
    return { code: 500, error: true, payload: null };
  }
};

//#endregion