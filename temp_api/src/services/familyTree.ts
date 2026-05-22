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
  spouseGapX: 250,
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

  /**
   * Inverted index of parent relationships: maps each child ID to the set of parent IDs connected to it.
   * Built from Kinship.parent connections where source = parent, target = child.
   * Used to group siblings under shared parents when constructing familyUnits.
   */
  const childToParents = new Map<number, Set<number>>();

  for (const c of connections) {
    if (c.type !== Kinship.parent) continue;
    const parentId = Number(c.source_family_member_id);
    const childId = Number(c.target_family_member_id);

    if (!childToParents.has(childId)) childToParents.set(childId, new Set());
    childToParents.get(childId)!.add(parentId);
  }

  /**
   * Groups children by their shared set of parents.
   * Key: sorted parent IDs joined by '-' (e.g. "3-7"), ensuring two parents always produce the same key regardless of discovery order.
   * Value: { parentIds, childIds } — all members of one nuclear family unit, used to place the RelationshipNode and GenerationLayer.
   */
  const familyUnits = new Map<string, { parentIds: number[]; childIds: number[] }>();
  /**
   * Groups couples together
   * Key: id for the first spouse found in loop
   * Value: id for their partner
   */
  const couples = new Map<string, { first: number; second: number }>();

  for (const [childId, parentSet] of childToParents) {
    const sortedParents = [...parentSet].sort((a, b) => a - b);
    const key = sortedParents.join('-');
    if (!familyUnits.has(key)) familyUnits.set(key, { parentIds: sortedParents, childIds: [] });
    familyUnits.get(key)!.childIds.push(childId);
  }

  const coordsMap = new Map<number, { x: number; y: number }>();
  const nodes: LayoutNode[] = [];
  /** Tracks how many children have already been placed for a given parent, used to offset each child horizontally so siblings don't overlap. */
  const childrenSlot = new Map<number, number>();
  /** Tracks how many parents have already been placed for a given child, used to offset each parent horizontally so co-parents don't overlap. */
  const parentsSlot = new Map<number, number>();
  /** Creates a LayoutNode for the given member at the given position and registers its coordinates in coordsMap. */
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
      const { treeNodeOffsetY, spouseGapX, siblingGapX } = LAYOUT_OFFSET;

      if (c.type === Kinship.parent) {
        // src = parent, tgt = child
        if (src === cur) {
          // Current is a parent; place child below with sibling spacing
          const slot = childrenSlot.get(cur) ?? 0;
          assign(tgt, { x: pos.x + slot * siblingGapX, y: pos.y + treeNodeOffsetY }, queue);
          childrenSlot.set(cur, slot + 1);
        } else if (tgt === cur) {
          // Current is a child; place parent above
          const slot = parentsSlot.get(cur) ?? 0;
          assign(src, { x: pos.x + slot * spouseGapX, y: pos.y - treeNodeOffsetY }, queue);
          parentsSlot.set(cur, slot + 1);
        }
      } else if (c.type === Kinship.sibling) {
        if (src === cur) assign(tgt, { x: pos.x + siblingGapX, y: pos.y }, queue);
        else if (tgt === cur) assign(src, { x: pos.x - siblingGapX, y: pos.y }, queue);
      } else if (c.type === Kinship.spouse) {
        if (src === cur) {
          assign(tgt, { x: pos.x + spouseGapX, y: pos.y }, queue);
          couples.set(`${src}`, { first: src, second: tgt });
        }
        else if (tgt === cur) assign(src, { x: pos.x - spouseGapX, y: pos.y }, queue);
      }
    }
  }

  // Co-parent alignment: ensure all parents of a family unit share the same Y level
  // and are spread evenly around their average X. Fixes cases where a second parent
  // is discovered from a child node and lands at the wrong Y or the same X as the first.
  for (const [, unit] of familyUnits) {
    const placedParents = unit.parentIds.filter(id => coordsMap.has(id));
    if (placedParents.length < 2) continue;

    const positions = placedParents.map(id => coordsMap.get(id)!);
    const targetY = Math.min(...positions.map(p => p.y));
    const avgX = positions.reduce((s, p) => s + p.x, 0) / positions.length;
    const { spouseGapX } = LAYOUT_OFFSET;

    placedParents.forEach((id, i) => {
      const offset = (i - (placedParents.length - 1) / 2) * spouseGapX;
      const newPos = { x: avgX + offset, y: targetY };
      coordsMap.set(id, newPos);
      const nodeIdx = nodes.findIndex(n => n.id === String(id));
      if (nodeIdx >= 0) nodes[nodeIdx].position = newPos;
    });
  }

  let orphanCol = 0;
  for (const m of members) {
    if (coordsMap.has(m.id)) continue;
    placeNode(m.id, { x: orphanCol++ * 180, y: 80 - LAYOUT_OFFSET.treeNodeOffsetY });
  }

  const edges: LayoutEdge[] = [];

  for (const [key, unit] of familyUnits) {
    const parentPositions = unit.parentIds.map(id => coordsMap.get(id)).filter((p): p is { x: number; y: number } => p != null);
    const childPositions = unit.childIds.map(id => coordsMap.get(id)).filter((p): p is { x: number; y: number } => p != null);
    if (parentPositions.length === 0 || childPositions.length === 0) continue;

    const avg = (arr: { x: number; y: number }[], k: 'x' | 'y') => arr.reduce((s, p) => s + p[k], 0) / arr.length;
    const parentsAvgX = avg(parentPositions, 'x');
    const parentsAvgY = avg(parentPositions, 'y');
    const childrenAvgX = avg(childPositions, 'x');
    const childrenAvgY = avg(childPositions, 'y');
    const relNodeId = `rel-${key}`;
    const glId = `gl-${key}`;

    const parentMembers = unit.parentIds.map(id => membersMap.get(id)).filter((m): m is FamilyMember => m != null);

    // RelationshipNode: between parents, at their Y level
    nodes.push({
      id: relNodeId,
      type: NODE_TYPES.relationNode,
      position: { x: parentsAvgX - 50, y: parentsAvgY },
      draggable: true,
      data: {
        label: `Children of ${parentMembers.map(m => m.first_name).join(' and ')}`,
        sources: parentMembers.map(m => ({ id: m.id, first_name: m.first_name, last_name: m.last_name })),
      },
    });

    // GenerationLayer: ~50 units above the children row
    nodes.push({
      id: glId,
      type: NODE_TYPES.generationLayer,
      position: { x: childrenAvgX, y: childrenAvgY - 50 },
      draggable: true,
      data: { label: '', childIds: unit.childIds },
    });

    // Each parent → RelationshipNode (one edge per parent, routed to its own target handle)
    unit.parentIds.forEach(pid => {
      if (!coordsMap.has(pid)) return;
      edges.push({
        id: `e-parent-rel-${pid}-${key}`,
        source: String(pid),
        target: relNodeId,
        type: NODE_TYPES.customEdge,
        targetHandle: `in-from-${pid}`,
      });
    });

    // RelationshipNode → GenerationLayer
    edges.push({
      id: `e-rel-gl-${key}`,
      source: relNodeId,
      target: glId,
      type: NODE_TYPES.customEdge,
      sourceHandle: 'out-to-gl',
      targetHandle: 'in-from-rel',
    });

    // GenerationLayer → each child (one edge per child, from its own source handle)
    unit.childIds.forEach(cid => {
      if (!coordsMap.has(cid)) return;
      edges.push({
        id: `e-gl-child-${glId}-${cid}`,
        source: glId,
        target: String(cid),
        type: NODE_TYPES.customEdge,
        sourceHandle: `out-to-child-${cid}`,
      });
    });

  }

  // Spousal edges: direct connection between the two spouses, outside the familyUnits loop
  couples.forEach(({ first, second }) => {
    if (!coordsMap.has(first) || !coordsMap.has(second)) return;
    edges.push({
      id: `e-spouse-${first}-${second}`,
      source: String(first),
      target: String(second),
      type: NODE_TYPES.spouseEdge,
    });
  });

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
export const deleteTree = async (data: { id: number, userId: number }): Promise<ServiceResponseWithPayload<null>> => {
  let response: ServiceResponseWithPayload<null> = { code: 500, error: true, payload: null };

  try {
    const tree = await FamilyTree.findByPk(data.id);
    const user = await User.findByPk(data.userId);
    const isAllowed = !!tree?.dataValues && tree.dataValues.created_by_id == user?.id;

    if (isAllowed) {
      await tree.update({ active: false });
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
export const deleteAll = async (payload: { list: number[], requester: number }) => {
  const { list, requester } = payload;
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