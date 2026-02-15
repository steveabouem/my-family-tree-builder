import React, { memo, useContext, useEffect, useState } from 'react';
import {
  Background,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from '@xyflow/react';
import { useFormikContext } from 'formik';
import { Trans } from '@lingui/macro';
import { Button, useTheme } from '@mui/material';
import '@xyflow/react/dist/style.css';
import CustomNode from './TreeNode';
import { useZDispatch, useZSelector } from 'app/hooks';
import GlobalContext from 'contexts/creators/global';
import NodeMenu from './NodeMenu';
import { setStepsCountAction, changeModeAction, changeformStepAction } from 'app/slices/forms/stepForm';
import { ReactFlowEdge, ReactFlowNode, NodeMenuActions, stepFormModes, FamilyMemberDTO, FamilyTreeState, UserState, MemberPosition } from 'types';
import DataProgress from 'components/common/progressIndicators/DataProgress';
import BoxColumn from 'components/common/containers/row/BoxColumn';
import BoxRow from 'components/common/containers/column';
import { useChangeMemberPositions, useDeleteMembers } from 'api';

const nodeTypes = {
  custom: CustomNode,
};
const bgUrls = {
  leaves: 'https://images.pexels.com/photos/22821246/pexels-photo-22821246/free-photo-of-plants-leaves-in-black-and-white.jpeg',
  branches: 'https://images.unsplash.com/photo-1622109874616-63c5ac24fe5a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  roots: 'https://plus.unsplash.com/premium_photo-1674940593973-f520ef5054bc?q=80&w=718&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

const GenealogyTree = memo(() => {
  const [nodesList, setNodesList, onNodesListChange] = useNodesState<any>([]);
  const [edgesList, setEdgesList, onEdgesListChange] = useEdgesState<any>([]);
  const [pendingPositions, setPositionsPending] = useState<MemberPosition[]>([]);
  const [treeBg, setTreeBg] = useState<string>(bgUrls.leaves);
  const { setValues, setFieldValue } = useFormikContext<any>();
  const { updateModal, clearModal } = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const { currentFamilyTree } = useZSelector<FamilyTreeState>(state => state.tree);
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const theme = useTheme();
  const { mutate: savePositionsMutation } = useChangeMemberPositions();
  const { mutate: deleteMemberMutation } = useDeleteMembers();

  useEffect(() => {
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
            if (!!currentFamilyTree?.id) {
              const newTree = deleteMemberMutation({ nodeId: node.node_id, treeId: currentFamilyTree.id });
              console.log({ newTree });
              // if (newTree.payload)
              // dispatch(populateTreeAction(newTree.payload))
            }
            //reset form state in case it was in edit mode
            dispatch(changeModeAction(stepFormModes.create));
            break;
        }
      },
      content: <NodeMenu data={node} />,
    });
  }
  function showCoordinatesChangeWarning(event: any, action: any) {
    updateModal({
      hidden: false,
      buttons: {
        cancel: true,
        cancelText: <Trans>modal_no_continue</Trans>,
        confirm: true,
        confirmText: <Trans>save</Trans>,
      },
      // @ts-ignore
      title: <Trans>save_position_or_continue_title {action.first_name}?</Trans>,
      content: <Trans>save_position_or_continue_msg</Trans>,
      onConfirm: () => {
        savePositionsMutation({
          data: [...pendingPositions, { new_position: action.position, node_id: action.node_id }],
          userId: currentUser?.userId || 0
        });
        clearModal();
      },
      onCancel: () => {
        setPositionsPending((prev => ([
          ...prev, { new_position: action.position, node_id: action.node_id }
        ])));
        clearModal();
      }
    });
  }
  function showCoordinatesChangeConfirm() {
    updateModal({
      hidden: false,
      buttons: {
        cancel: true,
        confirm: true,
      },
      title: <Trans>save_position_confirm_title?</Trans>,
      content: <Trans>save_position_confirm_msg</Trans>,
      onConfirm: () => {
        savePositionsMutation({ data: pendingPositions, userId: currentUser?.userId || 0 });
      },
      onCancel: () => {
        clearModal();
      }
    });
  }
  // TODO: this is not being managed properly. Edges are not showing.
  function generateNodesAndEdges() {
    const incomingNodes: FamilyMemberDTO[] = currentFamilyTree?.members || [];
    const incomingEdges = incomingNodes.reduce((listOfEdges: any, node: any) => {
      const nodeConnections = node?.connections || [];

      if (nodeConnections?.length) {
        console.log('CONNECTIONS ', nodeConnections);

        return [...listOfEdges, nodeConnections || []];
      } else {
        return listOfEdges;
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

  function toggleBackground() {
    switch (treeBg) {
      case bgUrls.branches:
        setTreeBg(bgUrls.leaves);
        break;
      case bgUrls.leaves:
        setTreeBg(bgUrls.roots);
        break;
      case bgUrls.roots:
        setTreeBg(bgUrls.branches);
        break;
      default:
        setTreeBg(bgUrls.leaves);
        break;
    }
  };

  if (!currentFamilyTree) {
    return <DataProgress
      msg={<Trans>fill_in_the_form_first</Trans>} />
  }

  return (
    <BoxColumn sx={{ position: 'relative',height: '100%', width: '100%' }}>
      <BoxRow sx={{position: 'absolute', top: '0', left: 0, justifyContent: 'space-between', width: '100%', gap: '1em'}}>
        {pendingPositions.length ? <Button variant='text' color='secondary' sx={positionButonStyle} onClick={showCoordinatesChangeConfirm}><Trans>save_positions</Trans></Button> : ''}
        <Button variant='text' color='secondary' onClick={toggleBackground} sx={{zIndex: 15}}><Trans>change_background</Trans></Button>
      </BoxRow>
      <ReactFlow
        nodes={nodesList} edges={edgesList} nodeTypes={nodeTypes} onNodeDrag={moveNode}
        onNodeDoubleClick={showEditModal} onNodesChange={onNodesListChange} connectOnClick
        onNodeDragStop={showCoordinatesChangeWarning}
      >
        <Background
          style={{
            backgroundSize: '100% 100%',
            backgroundBlendMode: 'overlay',
            backgroundRepeat: 'no-repeat',
            backgroundColor: theme.palette.grey['400'],
            backgroundImage: `url(${treeBg})`,
            borderRadius: '5px',
            height: '100%',
            transition: '.6s'
          }} />
        {/* <MiniMap /> */}
        <Controls />
      </ReactFlow>
    </BoxColumn>
  );
});

const positionButonStyle = {
  // position: 'absolute',
  zIndex: 10,
  top: '20%'
};

export default GenealogyTree;