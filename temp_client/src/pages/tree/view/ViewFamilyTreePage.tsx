import React, { ReactElement, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Collapse, FormControl, FormControlLabel, Grid2, List, ListItemIcon, MenuItem, Radio, RadioGroup, Select, Typography, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Edge } from "@xyflow/react";
import Page from "components/common/Page";
import { CreateTreeResponseV2, FlowComponentTypes, Kinship, RelationshipDTOV2, FamilyMemberDTOV2, DropdownOption } from "types";
import PageUrlsEnum from "utils/urls";
import { useDeleteTree, useGetTreeById } from "api/familyTree";
import GlobalContext from "contexts/creators/global";
import { Trans } from "@lingui/macro";
import GenealogyTree from "../layout/GenealogyTree";
import { parentGap, siblingGap, spouseGap } from "../constants";
import BoxRow from "components/common/containers/column";
import { CollapseIcon, DeleteIcon, ExpandIcon } from "utils/assets/icons";
import BoxColumn from "components/common/containers/row/BoxColumn";

const offsetByKinship: Record<string, { x: number; y: number }> = {
  [Kinship.parent as string]: parentGap,
  [Kinship.sibling as string]: siblingGap,
  [Kinship.spouse as string]: spouseGap,
};

type Coords = { x: number; y: number };
interface ExpandedSections {
  tree: boolean;
  currentMember: boolean;
}
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
): Array<{ id: string; type: string; position: Coords; data: Record<string, unknown>, draggable: boolean }> {
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
  const nodes: Array<{ id: string; type: string; position: Coords; data: Record<string, unknown>, draggable: boolean }> = [];
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
      draggable: false //TODO: paywall for premium to set to true

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
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({ tree: true, currentMember: false });
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any | undefined>();
  const [showBloodRelatives, setShowBloodRelatives] = useState<any | undefined>();
  const { loading, toggleLoading } = useContext(GlobalContext);
  const { id } = useParams();
  const { data, isLoading: isUserTreeLoading, isSuccess, isError, refetch } = useGetTreeById(id || '', true);
  const { mutate: deleteTreeMutation, isPending: isDeletePending, isSuccess: deleteTreeSuccess } = useDeleteTree(Number(id));
  const theme = useTheme();
  const { updateModal } = useContext(GlobalContext);
  const navigate = useNavigate();
  const isProcessing = loading || isUserTreeLoading || isDeletePending;
  const currentTree = data?.payload?.tree;
  const members = data?.payload?.members || [];
  const membersDropdownOptions: (DropdownOption & { key?: string })[] = useMemo(() => members.map((m: any, index: number) => {
    return (
      {
        label: `${m.first_name} ${m.last_name}`,
        value: m,
        id: m?.node_id,
        key: `member-dd-option-${index}`
      }
    )
  }), [data?.payload]);

  useEffect(() => {
    if (!isSuccess || !data?.payload) return;
    const p = data.payload as CreateTreeResponseV2['payload'];
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

  }, [deleteTreeMutation]);
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

  function showDeleteWarning() {
    updateModal({
      hidden: false,
      buttons: {
        cancel: true,
        confirm: true,
      },
      type: 'warning',
      title: <Trans>delete_tree_warning_title?</Trans>,
      content: <Trans>delete_tree_warning_msg</Trans>,
      onConfirm: () => {
        deleteTreeMutation();
      },
    });
  }
  function toggleSection(section: string) {
    setExpandedSections((prev: any) => ({ ...prev, [section]: !prev?.[section] }));
  }
  function renderSidebarSection(content: ReactElement[], collapseKey: keyof ExpandedSections, title: string | ReactNode) {
    return (
      <BoxColumn >
        <List sx={{ borderRadius: '5px' }}>
          <BoxRow sx={{ justifyContent: 'space-between', width: '100%', padding: '.5em' }}>
            <Typography variant="body2" sx={{ flex: 1 }}>{title}</Typography>
            <ListItemIcon sx={{ justifyContent: 'end' }}>
              {expandedSections[collapseKey] ?
                <ExpandIcon link onClick={() => toggleSection(collapseKey)} color={theme.palette.primary.contrastText} />
                :
                <CollapseIcon link onClick={() => toggleSection(collapseKey)} color={theme.palette.primary.contrastText} />
              }
            </ListItemIcon>
          </BoxRow>
          <Collapse in={expandedSections[collapseKey]} sx={collapseStyles}>
            {content}
          </Collapse>
        </List>
      </BoxColumn>
    );
  }
  function renderTreeStats() {
    const metrics: { [key: string]: any } = {
      total_members: members?.length || 'N/A',
      youngest: 'not_available',
      oldest: 'not_available',
      pending_invites: 'not_available',
      collaborators_count: 'not_available',
      members_with_user_profile: 'not_available',
      members_without_user_profile: 'not_available',
      full_user_profiles: 'not_available',
      average_children_per_family: 'not_available',
      number_of_marriages_or_couples: 'not_available'
    };

    const metricsItems = Object.keys(metrics).map((m: string) => (
      <BoxRow sx={{ gap: '1rem', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2"><Trans>{m}</Trans>:</Typography>
        <Typography variant="body2">{<Trans>{metrics[m]}</Trans>}</Typography>
      </BoxRow>
    ));

    return renderSidebarSection(metricsItems, 'tree', <Trans>tree_stats</Trans>);
  }

  function renderMemberStats() {
    const memberMetrics: { [key: string]: any } = {
      age: selectedMember?.age || 'N/A',
    };

    const statItems = Object.keys(memberMetrics).map((m: string, index: number) => (
      <BoxColumn>
        <Typography variant="subtitle1">view_blood_only?</Typography>
        <RadioGroup
          aria-labelledby="blodline-toggle-options-group"
          name="bloodline-toggle-options"
          value={showBloodRelatives}
          sx={{ display: 'flex', gap: 2, justifyContent: 'start', flexDirection: 'row' }}
        >
          <FormControlLabel
            value={false} control={<Radio size='small' onClick={() => setShowBloodRelatives(false)} />}
            label={
              <Typography variant='body1'
                fontWeight="bold">
                <Trans>no</Trans>
              </Typography>
            }
          />
          <FormControlLabel
            value={true} control={<Radio size='small' onClick={() => setShowBloodRelatives(true)} />}
            label={
              <Typography variant='body1'
                fontWeight="bold">
                <Trans>yes</Trans>
              </Typography>
            }
          />
        </RadioGroup>
        <BoxRow sx={{ gap: '1rem', justifyContent: 'space-between' }}>
          {!selectedMember?.id ? (
            <>
              <Typography variant="subtitle2"><Trans>no_member_selected</Trans>:</Typography>
              <Typography variant="body2">{<Trans>please_click_or_select</Trans>}</Typography>
            </>
          ) : (
            <>
              <Typography variant="subtitle2"><Trans>{m}</Trans>:</Typography>
              <Typography variant="body2">{<Trans>{memberMetrics[m]}</Trans>}</Typography>
            </>
          )}
        </BoxRow>
      </BoxColumn>
    ));


    return renderSidebarSection(statItems, 'currentMember', <Trans>member_details</Trans>);
  }


  return (
    <Page error={isError} reload={refetch} subtitle="" title={`${currentTree?.name ?? ''}`} prevUrl={PageUrlsEnum.trees} loading={isProcessing}>
      <BoxColumn>
        <Typography variant="h4">sorting_member_selection</Typography>
        <BoxColumn>
          <BoxRow>
            <Typography variant="subtitle2"><Trans>select_member</Trans></Typography>
            <FormControl sx={{ width: '100%', height: '35px' }}>
              <Select
                // @ts-ignore
                value={selectedMember?.id || 'N/A'}
                variant="standard"
                placeholder={`${<Trans>select</Trans>}`}
                labelId=""
                id={id || ''}
                label={<Trans>{selectedMember?.first_name || 'N/A'}</Trans>}
                size="small"
                onChange={(e) => setSelectedMember(e.target.value)}
                defaultValue=""
              >
                {membersDropdownOptions.map((option: DropdownOption, i: number) => {
                  const isSelected = selectedMember?.id === option.id;

                  return (
                    <MenuItem
                      value={option.value}
                      key={`${id || ''}-dropdown-option-${i}`}
                      selected={isSelected}
                    >
                      {/* @ts-ignore */}
                      <Trans>{`${option.value.first_name} ${option.value.last_name}`}</Trans>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </BoxRow>
        </BoxColumn>

        <Typography variant="h4"><Trans>view</Trans></Typography>
        <BoxRow>
          <RadioGroup
            aria-labelledby="expand-tree-options-group"
            name="radio-buttons-group"
            value={isTreeExpanded}
            sx={{ display: 'flex', gap: 2, justifyContent: 'start', flexDirection: 'row' }}
          >
            <FormControlLabel
              value={false} control={<Radio size='small' onClick={() => setIsTreeExpanded(false)} />}
              label={
                <Typography variant='body1'
                  fontWeight="bold">
                  <Trans>expand_sidebar</Trans>
                </Typography>
              }
            />
            <FormControlLabel
              value={true} control={<Radio size='small' onClick={() => setIsTreeExpanded(true)} />}
              label={
                <Typography variant='body1'
                  fontWeight="bold">
                  <Trans>expand_tree</Trans>
                </Typography>
              }
            />
          </RadioGroup>
          <Button variant="outlined" color="error" onClick={() => { showDeleteWarning() }}
            sx={{ justifyContent: 'start', display: 'flex', gap: '1rem' }}
          >
            <Trans>delete_all</Trans>
            <DeleteIcon size={15} color={theme.palette.error.dark} tooltip={<Trans>delete</Trans>} />
          </Button>
        </BoxRow>
      </BoxColumn>
      <Grid2 container display="flex" sx={{ height: '80vh' }}>
        <Grid2 size={isTreeExpanded ? 1 : 4} display="flex" justifyContent="start" gap={2} flexDirection="column" sx={{ overflow: 'hidden' }}>
          <Typography variant="h4"><Trans>stats_and_progress_expandedSections</Trans></Typography>
          {renderMemberStats()}
          {renderTreeStats()}
        </Grid2>
        <Grid2 size={isTreeExpanded ? 11 : 8}>
          <GenealogyTree initialNodes={initialNodes} initialEdges={initialEdges} />
        </Grid2>
      </Grid2>
    </Page>
  );
}

const collapseStyles = { display: 'flex', flexDirection: 'column', gap: '1rem' };

export default ViewFamilyTreePage;

