import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import Page from "components/common/Page";
import { CreateTreeResponseV2, FamilyTreeDAOV2, FamilyTreeDTOV2, FamilyTreeState, FlowComponentTypes, Gender, Kinship, MemberVisibility, RelationshipDTOV2, FamilyMemberDTOV2 } from "types";
import PageUrlsEnum from "utils/urls";
import { useGetTreeById } from "api/familyTree";
import PaperSection from "components/common/containers/PaperSection";
import GlobalContext from "contexts/creators/global";
import { Trans } from "@lingui/macro";
import GenealogyTree from "../layout/GenealogyTree";
import { Edge } from "@xyflow/react";
import { parentGap, siblingGap, spouseGap } from "../constants";

const offsetByKinship: Record<string, { x: number; y: number }> = {
  [Kinship.parent as string]: parentGap,
  [Kinship.sibling as string]: siblingGap,
  [Kinship.spouse as string]: spouseGap,
};

type Coords = { x: number; y: number };

/**
 * Edge semantics (API / relationship.ts):
 * - type `parent`: source = child, target = parent
 * - type `child`: source = parent, target = child
 * Spouse & sibling: use horizontal offset only (same y as current node).
 */
function buildLayoutNodes(
  members: FamilyMemberDTOV2[],
  connections: Array<Omit<RelationshipDTOV2, 'created_at' | 'updated_at'>>,
  anchorId: number | null | undefined,
): Array<{ id: string; type: string; position: Coords; data: Record<string, unknown> }> {
  const byId = new Map(members.map((m) => [Number(m.id), m]));
  const nid = (v: unknown) => Number(v);

  const rootId =
    anchorId != null && !Number.isNaN(Number(anchorId)) && byId.has(Number(anchorId))
      ? Number(anchorId)
      : members[0] != null
        ? Number(members[0].id)
        : null;

  if (rootId == null) return [];

  const placed = new Map<number, Coords>();
  const nodes: Array<{ id: string; type: string; position: Coords; data: Record<string, unknown> }> = [];
  const childSlot = new Map<number, number>();

  const pushNode = (id: number, position: Coords) => {
    const m = byId.get(id);
    if (!m) return;
    placed.set(id, position);
    nodes.push({
      id: String(id),
      type: FlowComponentTypes.customNode,
      position,
      data: { label: `${m.first_name} ${m.last_name}`, ...m },
    });
  };

  const tryPlace = (neighborId: number, nextPos: Coords, q: Array<{ id: number; pos: Coords }>) => {
    if (!byId.has(neighborId) || placed.has(neighborId)) return;
    pushNode(neighborId, nextPos);
    q.push({ id: neighborId, pos: nextPos });
  };

  pushNode(rootId, { x: 0, y: 0 });
  const queue: Array<{ id: number; pos: Coords }> = [{ id: rootId, pos: { x: 0, y: 0 } }];

  while (queue.length) {
    const { id: cur, pos } = queue.shift()!;

    for (const c of connections) {
      const s = nid(c.source_family_member_id);
      const t = nid(c.target_family_member_id);
      const typ = String(c.type);

      if (typ === Kinship.parent) {
        if (s === cur) tryPlace(t, { x: pos.x, y: pos.y - 100 }, queue);
        else if (t === cur) {
          const slot = childSlot.get(cur) ?? 0;
          childSlot.set(cur, slot + 1);
          tryPlace(s, { x: pos.x + slot * 140, y: pos.y + 100 }, queue);
        }
      } else if (typ === Kinship.child) {
        if (s === cur) {
          const slot = childSlot.get(cur) ?? 0;
          childSlot.set(cur, slot + 1);
          tryPlace(t, { x: pos.x + slot * 140, y: pos.y + 100 }, queue);
        } else if (t === cur) tryPlace(s, { x: pos.x, y: pos.y - 100 }, queue);
      } else if (typ === Kinship.sibling) {
        const off = offsetByKinship[Kinship.sibling as string];
        if (s === cur) tryPlace(t, { x: pos.x + off.x, y: pos.y }, queue);
        else if (t === cur) tryPlace(s, { x: pos.x - off.x, y: pos.y }, queue);
      } else if (typ === Kinship.spouse) {
        const off = offsetByKinship[Kinship.spouse as string];
        if (s === cur) tryPlace(t, { x: pos.x + off.x, y: pos.y }, queue);
        else if (t === cur) tryPlace(s, { x: pos.x - off.x, y: pos.y }, queue);
      } else {
        if (s === cur) tryPlace(t, { x: pos.x + 120, y: pos.y }, queue);
        else if (t === cur) tryPlace(s, { x: pos.x - 120, y: pos.y }, queue);
      }
    }
  }

  let orphanCol = 0;
  const orphanY = 380;
  for (const m of members) {
    const idNum = Number(m.id);
    if (placed.has(idNum)) continue;
    pushNode(idNum, { x: orphanCol * 180, y: orphanY });
    orphanCol += 1;
  }
console.log({nodes});

  return nodes;
}

/**
 * 
 * @description:
 * this page will allow the user to consult their tree.
 * It will come with the following features:
    * switch between combined and bloodline tree - clicking on the spouse will allow the user to flip between their own blooline exclusively, their spouse's bloodline (if they're allowed)
    * View member visibility and filter by it 
 */
const ViewFamilyTreePage = () => {
  const [initialNodes, setInitialNodes] = useState<any>([]);
  const [initialEdges, setInitialEdges] = useState<any>([]);
  const { loading, toggleLoading } = useContext(GlobalContext);
  const { id } = useParams();
  const { data, isLoading: isUserTreeLoading, isSuccess, isError, refetch } = useGetTreeById(id || '', true);
  const isProcessing = loading || isUserTreeLoading;

  useEffect(() => {
    if (!isSuccess || !data?.payload) return;
    const p = data.payload as CreateTreeResponseV2['payload'];
    const members = p.members ?? (p as { tree_members?: unknown }).tree_members;
    const connections = p.connections ?? (p as { tree_relationships?: unknown }).tree_relationships ?? [];

    if (Array.isArray(members) && members.length > 0) {
      const anchorId =
        p.tree?.default_anchor_family_member_id ??
        (p as { default_anchor_family_member_id?: number | null }).default_anchor_family_member_id;
      generateNodesAndEdges({
        members: members as FamilyMemberDTOV2[],
        connections: (connections || []) as Omit<RelationshipDTOV2, 'created_at' | 'updated_at'>[],
        anchorId: anchorId != null ? Number(anchorId) : null,
      });
    }
  }, [data, isSuccess, isUserTreeLoading]);

  useEffect(() => {
    toggleLoading(false); // TODO: global context;s loading seems redundant
  }, []);

  function generateNodesAndEdges(payload: {
    members: FamilyMemberDTOV2[];
    connections: Array<Omit<RelationshipDTOV2, 'created_at' | 'updated_at'>>;
    anchorId: number | null;
  }) {
    const initialNodes = buildLayoutNodes(payload.members, payload.connections, payload.anchorId);
    const initialEdges: Edge[] = payload.connections.map((c: any) => ({
      id: `${c.source_family_member_id}-${c.target_family_member_id}-${c.id}`,
      type: FlowComponentTypes.customEdge,
      source: `${c?.source_family_member_id || ''}`,
      target: `${c?.target_family_member_id || ''}`,
    }));

    setInitialNodes(initialNodes);
    setInitialEdges(initialEdges);
  }

  return (
    <Page error={isError} reload={refetch} subtitle="" title={`${data?.payload?.tree?.name ?? (data?.payload as { name?: string })?.name ?? ''}`} prevUrl={PageUrlsEnum.trees} loading={isProcessing}>
      <Box sx={mainContainerStyle}>
        <PaperSection >
          <Trans>view_tree_page_title</Trans>
          <GenealogyTree initialNodes={initialNodes} initialEdges={initialEdges} />
        </PaperSection>
      </Box>
    </Page>
  );
}

const mainContainerStyle = {
  height: '80vh',
  width: '100%',
  position: 'absolute',
};

export default ViewFamilyTreePage;

