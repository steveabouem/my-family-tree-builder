import React, { ReactElement, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Button, Collapse, FormControl, FormControlLabel, Grid2, List, ListItemIcon, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Typography, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Edge } from "@xyflow/react";
import Page from "components/common/Page";
import { FlowComponentTypes, KinshipType, RelationshipDTOV2, FamilyMemberDTOV2, DropdownOption, TreeNodeProps, Coorddinates } from "types";
import PageUrlsEnum from "utils/urls";
import { useDeleteTree, useGetTreeById } from "api/familyTree";
import GlobalContext from "contexts/creators/global";
import { Trans } from "@lingui/macro";
import GenealogyTree from "../layout/GenealogyTree";
import BoxRow from "components/common/containers/column";
import { CollapseIcon, DeleteIcon, ExpandIcon, WritingIcon } from "utils/assets/icons";
import BoxColumn from "components/common/containers/row/BoxColumn";
import { useTreeSummary } from "pages/hooks/useTreeSummary";
import { useGetMEmberBloodline } from "api";
import LocalSpinner from "components/common/progressIndicators/LocalSpinner";
import { parentGap, siblingGap, spouseGap, treeNodeOffsetX, treeNodeOffsetY, treeNodeParentOffsetX, treeNodeParentOffsetY } from "../../constants";

const offsetByKinship: Record<string, { x: number; y: number }> = {
  [KinshipType.parent as string]: parentGap,
  [KinshipType.sibling as string]: siblingGap,
  [KinshipType.spouse as string]: spouseGap,
};

interface ExpandedSections {
  tree: boolean;
  currentMember: boolean;
}

interface Intersection { position: Coorddinates; name: string | ReactElement }
interface GenerationLayer { position: Coorddinates; childrenCount: number; }
/**
 * ### Builds the nodes and edges based on the members, connections and starting point (anchor) #
 * *Edge semantics (API / relationship.ts):*
 * - type `parent`: source = child, target = parent
 * - type `child`: source = parent, target = child * #
 * *Spouse & <sibling:*
 * - use horizontal offset only (same y as current node).
 */
function buildLayoutNodes(
  members: FamilyMemberDTOV2[],
  connections: Array<Omit<RelationshipDTOV2, 'created_at' | 'updated_at'>>,
  anchorId: number | null | undefined,
): TreeNodeProps[] {
  /**
   * ### Map of all the members. #
   *  *Key is the member's id*
   */
  const membersMap = new Map(members.map((m) => [Number(m.id), m]));
  const changeIdToNumber = (v: unknown) => Number(v);
  /**
    * ### Array of custom nodes. 
    *- Sits in between a group of children and their parents. 
    *- Needs all parents names at least
    *- Single parent: it will form a straight line with the custom node sitting  directly below the parent,
    *   and above the mid section of the children's generation layer
    *- 2 parents: wil share a spouse edge horizontally, then from the middle of that edge will grow a vertical edge connecting to this custom node, which will then connect to the generation layer below
    * - **Note:** Styling of type of spousal relationship is not implemented yet 
    * #
    * **Parents should always be above the mid section of the children**
  */
  const childrenLabelNodes: Intersection[] = [];
  /**
    * ### Array of custom edges. 
    * - Sits above a group of siblings. 
    * - Length is calculated based on the length of the children array of the parent.
  */
  const generationEdges: GenerationLayer[] = [];

  /**
   * IS either the anchor_id provided or the first member in the list provided in args
   */
  const rootId =
    anchorId != null && !Number.isNaN(Number(anchorId)) && membersMap.has(Number(anchorId))
      ? Number(anchorId)
      : members[0] != null
        ? Number(members[0].id)
        : null;

  if (rootId == null) return [];

  /**
   * ### A map of each member's coordinates.
   * *Key=id, value=coordinates*
   **/
  const membersCoordinatesMap = new Map<number, Coorddinates>();
  /**
   * ### Array populated based on the placed map. #
   *  *It contains all the props to render the member's TreeNode*
   */
  const nodes: TreeNodeProps[] = []; // the nodes linked to the placed relationships
  const childSlot = new Map<number, number>();
  /**
   * ### Creates a new node and pushes it to the nodes placeholder, with relevant coordinates 
  */
  const setNewNodeFromMember = (id: number, position: Coorddinates) => {
    const m = membersMap.get(id);
    if (!m) return;
    membersCoordinatesMap.set(id, position);
    nodes.push({
      id: String(id),
      type: FlowComponentTypes.customNode,
      position,
      data: { label: `${m.first_name} ${m.last_name}`, ...m },
      draggable: true //TODO: paywall for premium to set to true

    });
  };

  //! TODO: move this back to the server, needed to allow and control editPosition endpoint
  /**
   * @param neighborId 
   * @param nextPos 
   * @param corrdinatesQueue 
   * ### Checks the list of coordinates against the map of members, given a member id and a set of coordinates
   * - If given member id maps to an actual member to the list AND the given member id doesn't have coordinates assigned yet, 
   *  create the data for the member's custom node and its coordinates
   * - Otherwise ignore it, it already was assigned coordinates (or doesn't exist in the curren tree)
   */
  const assignCoordinatesToMemberNode = (neighborId: number, nextPos: Coorddinates, corrdinatesQueue: { id: number; pos: Coorddinates }[]) => {
    if (!membersMap.has(neighborId) || membersCoordinatesMap.has(neighborId)) return;
    setNewNodeFromMember(neighborId, nextPos);
    corrdinatesQueue.push({ id: neighborId, pos: nextPos });
  };

  setNewNodeFromMember(rootId, { x: 0, y: 0 });
  /**
   * The array of coordinates keyed to their member id -taken from the source or target of hte relevant connection (Relationship)-
   *  #
   * *it will be emptied as those coordinates are applied to the new node for that family member*
   */
  const queue: { id: number; pos: Coorddinates }[] = [{ id: rootId, pos: { x: 0, y: 0 } }];

  while (queue.length) {
    // get the first one, use non null assertion operator to prevent ts from crying
    const { id: cur, pos } = queue.shift()!;

    for (const c of connections) {
      const connectionSourceId = changeIdToNumber(c.source_family_member_id);
      const connectionTargetId = changeIdToNumber(c.target_family_member_id);
      const connectionType = c.type;
      const labelSourceId = Math.floor(Math.random() * 100);// ? there will be several families in the tree, this id variable is not supposed to be unique. It only needs to be unique for each family unit. AS SUCH, it might need to be moved to the top of the function and not redefined everytime the loop moves to the next connection
      const labelTargetId = Math.floor(Math.random() * 1000);// ? there will be several families in the tree, this id variable is not supposed to be unique. It only needs to be unique for each family unit. AS SUCH, it might need to be moved to the top of the function and not redefined everytime the loop moves to the next connection
      const genLayerSourceId = Math.floor(Math.random() * 10);// ? there will be several families in the tree, this id variable is not supposed to be unique. It only needs to be unique for each family unit. AS SUCH, it might need to be moved to the top of the function and not redefined everytime the loop moves to the next connection
      const genLayerTargetId = Math.floor(Math.random() * 10000);// ? there will be several families in the tree, this id variable is not supposed to be unique. It only needs to be unique for each family unit. AS SUCH, it might need to be moved to the top of the function and not redefined everytime the loop moves to the next connection
      // TYPE PARENT 
      if (connectionType === KinshipType.parent) {
        if (connectionSourceId === cur) {
          assignCoordinatesToMemberNode(connectionTargetId, { x: pos.x, y: pos.y + treeNodeOffsetY }, queue);
          console.log('SOURCE IS A PARENT, their id is ', {connectionSourceId, cur, connectionType, queue});
        } else if (connectionTargetId === cur) {
          const slot = childSlot.get(cur) ?? 0;
          const targetData = membersMap.get(connectionTargetId);
          /**
           * programatically generate the edge between the relation node and the parent (target) of the "parent" connction
           */
          const ParentToLabelonnection: RelationshipDTOV2 = {// UNIQUE TO THIS FAMILY UNIT
            created_at: '',
            updated_at: '',
            id: labelSourceId,
            target_family_member_id: connectionTargetId,
            source_family_member_id: labelSourceId,
            tree_id: c.tree_id,
            type: FlowComponentTypes.relationNode
          };
          const labelToGenLayeronnection: RelationshipDTOV2 = {// UNIQUE TO THIS FAMILY UNIT
            created_at: '',
            updated_at: '',
            id: labelTargetId,
            source_family_member_id: genLayerSourceId,
            target_family_member_id: labelTargetId,
            tree_id: c.tree_id,
            type: FlowComponentTypes.generationLayer
          };
          const genLayerToChildrenMedianConnection: RelationshipDTOV2 = {// UNIQUE TO THIS FAMILY UNIT
            created_at: '',
            updated_at: '',
            id: genLayerTargetId,
            target_family_member_id: labelSourceId,
            source_family_member_id: genLayerTargetId,
            tree_id: c.tree_id,
            type: FlowComponentTypes.generationLayer
          };
          /**
           * Programaticlly generate the custom node that will hold the line above the children, and add it to the main members list?
           */
          const childLabelNode = {
            data: {
              first_name: '__________', last_name: '', label: '___________', node_id: 'RELATION',
              sources: [targetData]
            }, id: labelSourceId, position: { x: pos.x - treeNodeParentOffsetX, y: pos.y - treeNodeParentOffsetY }, type: FlowComponentTypes.relationNode
          };
          const genLayerNode = {
            data: {
              first_name: '__________', last_name: '', label: '___________', node_id: 'LAYER',
              sources: [childLabelNode]
            }, id: genLayerSourceId, position: { x: pos.x - treeNodeOffsetX, y: pos.y - treeNodeParentOffsetY }, type: FlowComponentTypes.generationLayer
          };


          // TODO: use the map to check if a child label is already there before adding a new one
          // // @ts-ignore
          // membersMap.set(labelSourceId, childLabelNode);
          // // @ts-ignore
          // membersMap.set(genLayerSourceId, genLayerNode);

          assignCoordinatesToMemberNode(labelSourceId, { x: pos.x - treeNodeParentOffsetX, y: pos.y - treeNodeParentOffsetY }, queue);
          assignCoordinatesToMemberNode(genLayerSourceId, { x: pos.x - treeNodeOffsetX, y: pos.y - treeNodeParentOffsetY }, queue)
          childSlot.set(cur, slot + 1);
        }
      } else if (connectionType === KinshipType.child) {
        if (connectionSourceId === cur) {
          const slot: number = childSlot.get(cur) ?? 0;

          childSlot.set(cur, slot + 1);
          assignCoordinatesToMemberNode(connectionTargetId, { x: pos.x + slot * 140, y: pos.y + 100 }, queue);
        } else if (connectionTargetId === cur) assignCoordinatesToMemberNode(connectionSourceId, { x: pos.x, y: pos.y - 100 }, queue);
      } else if (connectionType === KinshipType.sibling) {
        const off = offsetByKinship[KinshipType.sibling as string];

        if (connectionSourceId === cur) assignCoordinatesToMemberNode(connectionTargetId, { x: pos.x + off.x, y: pos.y }, queue);
        else if (connectionTargetId === cur) assignCoordinatesToMemberNode(connectionSourceId, { x: pos.x - off.x, y: pos.y }, queue);
      } else if (connectionType === KinshipType.spouse) {
        const off = offsetByKinship[KinshipType.spouse as string];
        if (connectionSourceId === cur) assignCoordinatesToMemberNode(connectionTargetId, { x: pos.x + off.x, y: pos.y }, queue);
        else if (connectionTargetId === cur) assignCoordinatesToMemberNode(connectionSourceId, { x: pos.x - off.x, y: pos.y }, queue);
      } else {
        if (connectionSourceId === cur) assignCoordinatesToMemberNode(connectionTargetId, { x: pos.x + 120, y: pos.y }, queue);
        else if (connectionTargetId === cur) assignCoordinatesToMemberNode(connectionSourceId, { x: pos.x - 120, y: pos.y }, queue);
      }
    }
  }
  console.log('MEMBERS AFTER ', { membersMap, queue });

  let orphanCol = 0;
  const orphanY = 80;
  for (const m of members) {
    const idNum = Number(m.id);
    if (membersCoordinatesMap.has(idNum)) continue;
    setNewNodeFromMember(idNum, { x: orphanCol * 180, y: orphanY - treeNodeOffsetY });
    orphanCol += 1;
  }

  // @ts-ignore
  return [...nodes];
}

/**
 * 
 * ### this page will allow the user to consult their tree.
 * It will come with the following features:
    - switch between combined and bloodline tree - clicking on the spouse will allow the user to flip between their own blooline exclusively, their spouse's bloodline (if they're allowed)
    - View member visibility and filter by it 
 */
const ViewFamilyTreePage = () => {
  const [initialNodes, setInitialNodes] = useState<TreeNodeProps[]>([]);
  const [initialEdges, setInitialEdges] = useState<any>([]);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({ tree: true, currentMember: true });
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | undefined>();
  const [showBloodRelatives, setShowBloodRelatives] = useState<boolean>(false);
  const { loading, toggleLoading } = useContext(GlobalContext);
  const { id } = useParams();
  const { data, isLoading: isUserTreeLoading, isSuccess, isError, refetch } = useGetTreeById(id || '', true);
  const { mutate: deleteTreeMutation, isPending: isDeletePending, isSuccess: deleteTreeSuccess } = useDeleteTree(Number(id));
  const { data: bloodlineData, isLoading: isGetBloodlineLoading } = useGetMEmberBloodline(selectedMember?.id, showBloodRelatives);
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
  const treeSummary = useTreeSummary(data?.payload);

  useEffect(() => {
    if (!isSuccess || !data?.payload) return;
    const p = data.payload;
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
    setInitialNodes((prev: any) => {
      const update = prev.map((n: any) => ({ ...n, data: { ...n.data, selected: n.data.id === selectedMember.id } }));
      return update;
    });

  }, [selectedMember?.id]);

  useEffect(() => {
    const idsToHighlight = bloodlineData?.payload?.members?.map(m => m.id) || [];
    const highlightedNodes = initialNodes.map(n => {
      const shouldHighlightNode = showBloodRelatives && idsToHighlight.includes(n?.data?.id);

      return ({
        ...n, data: { ...n.data, highlighted: shouldHighlightNode }
      })
    });

    setInitialNodes([...highlightedNodes]);
  }, [showBloodRelatives, bloodlineData?.payload?.members]);

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
      // TODO: standardize this enum in both the front and the back
      type: c.type.includes(KinshipType.sibling) ? FlowComponentTypes.spouseEdge :
        c.type.includes(KinshipType.spouse) ? FlowComponentTypes.siblingEdge :
          FlowComponentTypes.customEdge,
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
                <CollapseIcon link onClick={() => toggleSection(collapseKey)} color={theme.palette.primary.contrastText} />
                :
                <ExpandIcon link onClick={() => toggleSection(collapseKey)} color={theme.palette.primary.contrastText} />
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
    const metricsItems = Object.entries(treeSummary).map(([key, metric]) => {
      // @ts-ignore
      const value = Array.isArray(metric) ? metric.length : metric?.id ? `${metric.first_name} ${metric.last_name}` : (metric || '__');

      return (
        <BoxRow sx={{ gap: '1rem', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2"><Trans>{key}</Trans>:</Typography>
          <Typography variant="body2">{value}</Typography>
        </BoxRow>
      )
    });

    return renderSidebarSection(metricsItems, 'tree', <Trans>tree_stats</Trans>);
  }

  function renderMemberStats() {
    const memberMetrics: { [key: string]: any } = {
      age: selectedMember?.age || 'N/A',
    };

    const statItems = Object.keys(memberMetrics).map((m: string, index: number) => (
      <BoxColumn>
        {isGetBloodlineLoading ? <LocalSpinner loading={true} /> : ''}
        {!!selectedMember && (
          <>
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
          </>
        )}
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


    return renderSidebarSection(statItems, 'currentMember', selectedMember?.first_name || '__');
  }

  function selectMember(e: SelectChangeEvent) {
    setShowBloodRelatives(false);
    setSelectedMember(e.target.value);
  }

  return (
    <Page error={isError} reload={refetch} subtitle="" title={`${currentTree?.name ?? ''}`} prevUrl={PageUrlsEnum.trees} loading={isProcessing}>
      <BoxColumn>
        <Typography variant="h4">options_and_filter</Typography>
        <BoxRow sx={{ justifyContent: 'start' }}>
          <RadioGroup
            aria-labelledby="expand-tree-options-group"
            name="radio-buttons-group"
            value={isTreeExpanded}
            sx={{ display: 'flex', gap: 2, justifyContent: 'start', flexDirection: 'row', width: '30%' }}
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
          <BoxRow sx={{ justifyContent: 'start', width: '40%' }}>
            <Typography variant="subtitle2"><Trans>select_member</Trans></Typography>
            <FormControl sx={{ height: '35px' }}>
              <Select
                // @ts-ignore
                value={selectedMember?.id || 'N/A'}
                variant="standard"
                placeholder={`${<Trans>select</Trans>}`}
                labelId=""
                id={id || ''}
                label={<Trans>{selectedMember?.first_name || 'N/A'}</Trans>}
                size="small"
                onChange={selectMember}
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
          <BoxRow sx={{ justifyContent: 'end', flex: 1 }}>
            <Button variant="text" color="info" onClick={() => { navigate(PageUrlsEnum.newTree) }}
              sx={{ justifyContent: 'start', display: 'flex', gap: '1rem' }}
            >
              <Trans>edit</Trans>
              <WritingIcon size={15} color={theme.palette.info.dark} tooltip={<Trans>go_to_edit_page</Trans>} />
            </Button>
            <Button variant="contained" color="error" onClick={() => { showDeleteWarning() }}
              sx={{ justifyContent: 'start', display: 'flex', gap: '1rem' }}
            >
              <Trans>delete</Trans>
              <DeleteIcon size={15} color={theme.palette.error.dark} tooltip={<Trans>delete</Trans>} />
            </Button>
          </BoxRow>
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

