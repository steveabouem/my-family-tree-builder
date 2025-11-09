import React, { memo, useContext, useEffect } from 'react';
import {
  Background,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
} from '@xyflow/react';
import { useFormikContext } from 'formik';
import { Trans } from '@lingui/macro';
import { useTheme } from '@mui/material';
import '@xyflow/react/dist/style.css';
import CustomNode from './TreeNode';
import { useZDispatch, useZSelector } from 'app/hooks';
import GlobalContext from 'contexts/creators/global';
import NodeMenu from './NodeMenu';
import { setStepsCountAction, changeModeAction, changeformStepAction } from 'app/slices/forms/stepForm';
import { ReactFlowEdge, ReactFlowNode, NodeMenuActions, stepFormModes, FamilyTreeRecord, FamilyMemberDTO, FamilyTreeState } from 'types';
import DataProgress from 'components/common/progressIndicators/DataProgress';

const nodeTypes = {
  custom: CustomNode,
};
const treeBgUrl = 'https://images.pexels.com/photos/22821246/pexels-photo-22821246/free-photo-of-plants-leaves-in-black-and-white.jpeg';

const GenealogyTree = memo(() => {
  const [nodesList, setNodesList, onNodesListChange] = useNodesState<any>([]);
  const [edgesList, setEdgesList, onEdgesListChange] = useEdgesState<any>([]);
  const { setValues, setFieldValue } = useFormikContext<any>();
  const { updateModal } = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const { currentFamilyTree } = useZSelector<FamilyTreeState>(state => state.tree);
  const theme = useTheme();

  useEffect(() => {
    // node is showing but not draggable. console errors mention missing coordinates?
    if (currentFamilyTree?.members?.length)
      generateNodesAndEdges();
  }, [currentFamilyTree?.members]);

  function populateFormWithNodeValues(node: ReactFlowNode) {
    setValues({
      // @ts-ignore: TODO FIX. easy
      anchor_firstName: node?.firstName || node?.first_name || '',
      // @ts-ignore: TODO FIX
      anchor_lastName: node?.lastName || node?.last_name || '',
      anchor_occupation: node?.occupation || '',
      anchor_dob: node?.dob || '',
      anchor_dod: node?.dod || '',
      anchor_email: node?.email || '',
      anchor_description: node?.description || '',
      anchor_gender: node.gender,
      anchor_marital_status: node.marital_status,
      anchor_node_id: node.node_id,
    });
  }
  function showEditModal(event: any, node: any) {
    setFieldValue('anchor_node_id', node.node_id);

    updateModal({
      hidden: false,
      buttons: {
        cancel: true,
        confirm: true
      },
      title: <Trans>choose_node_action_title {node.first_name}</Trans>,
      onConfirm: (transferData: string) => {
        switch (transferData) {
          case NodeMenuActions.edit:
            dispatch(changeModeAction(stepFormModes.edit));
            dispatch(setStepsCountAction(1));
            dispatch(changeformStepAction(0));
            populateFormWithNodeValues(node);

            break;
          case NodeMenuActions.add:
            break;
          case NodeMenuActions.delete:
            //reset form state in case it was in edit mode
            dispatch(changeModeAction(stepFormModes.create));
            break;
        }
      },
      content: <NodeMenu data={node} />,
    });
  }
  // TODO: this is not being managed properly. Edges are not showing.
  function generateNodesAndEdges() {
    const incomingNodes: FamilyMemberDTO[] = currentFamilyTree?.members || [];
    const incomingEdges = incomingNodes.reduce((listOfEdges: any, node: any) => {
      const nodeConnections = node?.connections || [];

      if (nodeConnections?.length) {
        return [...listOfEdges.flat(), nodeConnections.flat() || []];
      } else {
        return listOfEdges.flat();
      }
    }, []);
    const nodesList = incomingNodes.map(n => ({ ...n, id: n.node_id, draggable: true, selectable: true, data: { ...n, id: n.node_id } }));// ReactFlow only reads the data object
    setNodesList(nodesList);
    incomingEdges.forEach((e: any) => {// thats a lot of renders . use memo maybe?
      setEdgesList((eds) => addEdge(e, edgesList));
    });
  }
  function generateEdge(newEdge: any) {
    setEdgesList((prev: ReactFlowEdge[]) => {
      const targetEdge = prev.find((edge: ReactFlowEdge) => edge.id === newEdge.id);

      return ([...prev.filter((edge: ReactFlowEdge) => edge.id !== newEdge.id), targetEdge]);
    });
  }
  /*
  * Debouncing these, because otherwise it might blow up, especially if we implement group selection
  */
  function moveNode(action: any): void {
    const nodeTimeout = setTimeout(() => {
      const nodeUpdate = action?.[0];
      if (nodeUpdate?.type === 'position' && !nodeUpdate?.dragging) {
        const currentNode = nodesList.find((node: any) => node.node_id === nodeUpdate?.id);

        setNodesList((prev: any) => {
          const newNodes = prev.map((node: any) => {
            if (node.id === currentNode.id) {
              return {
                ...node,
                position: nodeUpdate.position,
              };
            }
            return node;
          });
          return newNodes;
        });
      }
    }, 300);
    clearTimeout(nodeTimeout);
  }

  if (!currentFamilyTree) {
    return <DataProgress
      msg={<Trans>fill_in_the_form_first</Trans>} />
  }

  return (
    <ReactFlow
      nodes={nodesList} edges={edgesList} nodeTypes={nodeTypes} onNodeDrag={moveNode}
      onNodeDoubleClick={showEditModal} onNodesChange={onNodesListChange}
    // onNodeDragStop={save to backend}
    >
      <Background
        style={{
          backgroundSize: '100% 100%',
          backgroundBlendMode: 'overlay',
          backgroundRepeat: 'no-repeat',
          backgroundColor: theme.palette.grey['400'],
          backgroundImage: `url(${treeBgUrl})`,
          borderRadius: '5px'
        }} />
      {/* <MiniMap /> */}
      {/* <Controls /> */}
    </ReactFlow>
  );
});

export default GenealogyTree;