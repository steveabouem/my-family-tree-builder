import { Op } from 'sequelize';
import FamilyMember  from '../models/FamilyMember';
import Relationship  from '../models/Relationship';

export async function getParents(memberId: number, treeId: number): Promise<FamilyMember[]> {
  const rels = await Relationship.findAll({
    where: {
      tree_id: treeId,
      type: 'child',
      target_member_id: memberId,
    },
  });

  const parentIds = rels.map(r => r.source_member_id);
  if (!parentIds.length) return [];

  return FamilyMember.findAll({ where: { id: { [Op.in]: parentIds }, tree_id: treeId } });
}

export async function getChildren(memberId: number, treeId: number): Promise<FamilyMember[]> {
  const rels = await Relationship.findAll({
    where: {
      tree_id: treeId,
      type: 'child',
      source_member_id: memberId,
    },
  });

  const childIds = rels.map(r => r.target_member_id);
  if (!childIds.length) return [];

  return FamilyMember.findAll({ where: { id: { [Op.in]: childIds }, tree_id: treeId } });
}

export async function getSpouses(memberId: number, treeId: number): Promise<FamilyMember[]> {
  const rels = await Relationship.findAll({
    where: {
      tree_id: treeId,
      type: 'spouse',
      [Op.or]: [
        { source_member_id: memberId },
        { target_member_id: memberId },
      ],
    },
  });

  const spouseIds = rels.map(r =>
    r.source_member_id === memberId ? r.target_member_id : r.source_member_id
  );
  if (!spouseIds.length) return [];

  return FamilyMember.findAll({ where: { id: { [Op.in]: spouseIds }, tree_id: treeId } });
}

export async function getAncestors(
  memberId: number,
  treeId: number,
  maxDepth: number
): Promise<FamilyMember[]> {
  const visited = new Set<number>();
  const result: FamilyMember[] = [];
  let currentLevel: number[] = [memberId];
  let depth = 0;

  while (currentLevel.length && depth < maxDepth) {
    const nextLevel: number[] = [];

    for (const id of currentLevel) {
      const parents = await getParents(id, treeId);
      for (const p of parents) {
        if (!visited.has(p.id)) {
          visited.add(p.id);
          result.push(p);
          nextLevel.push(p.id);
        }
      }
    }

    currentLevel = nextLevel;
    depth++;
  }

  return result;
}