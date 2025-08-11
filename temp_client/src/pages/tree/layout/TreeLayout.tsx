import React, { memo, useContext, useEffect } from 'react';
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
import { useTheme } from '@mui/material';
import '@xyflow/react/dist/style.css';
import CustomNode from './TreeNode';
import { DFamilyTreeDTO } from 'services/api.definitions';
import { DReactFlowEdge, DReactFlowNode, NodeMenuActions } from '../definitions';
import { useZDispatch } from 'app/hooks';
import GlobalContext from 'contexts/creators/global';
import NodeMenu from './NodeMenu';
import { setStepsCountAction, changeModeAction, changeformStepAction } from 'app/slices/forms/stepForm';
import { stepFormModes } from 'app/slices/definitions';

const nodeTypes = {
  blackbox: CustomNode,
};
const treeBgUrl = 'https://images.pexels.com/photos/22821246/pexels-photo-22821246/free-photo-of-plants-leaves-in-black-and-white.jpeg';

const LayoutFlow = memo(({ tree }: { tree: DFamilyTreeDTO }) => {
  const [nodesList, setNodesList] = useNodesState<any>([]);
  const [edgesList, setEdgesList] = useEdgesState<any>([]);
  const { setValues } = useFormikContext<any>();
  const { updateModal } = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const theme = useTheme();

  useEffect(() => {
    if (Object.keys(tree)?.length)
      generateNodesAndEdges();
    // eslint-disable-next-line
  }, [tree]);

  function populateFormWithNodeValues(node: DReactFlowNode) {
    setValues({
      anchor_firstName: node?.firstName || '',
      anchor_lastName: node?.lastName || '',
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
    updateModal({
      hidden: false,
      buttons: {
        cancel: true,
        confirm: true
      },
      title: <Trans>choose_node_action_title {node.firstName}</Trans>,
      onConfirm: (transferData: string) => {
        switch (transferData) {
          case NodeMenuActions.edit:
            dispatch(changeModeAction(stepFormModes.edit));
            dispatch(setStepsCountAction(1));
            dispatch(changeformStepAction(0));
            populateFormWithNodeValues(node.data);

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
  // TODO: this is not being managed properly. Edges are not showing
  function generateNodesAndEdges() {
    const incomingNodes: any = Object.values(tree);
    const incomingEdges = incomingNodes.reduce((listOfEdges: any, node: any) => {
      if (node?.data?.connections?.length) {
        return [...listOfEdges.flat(), node.data?.connections?.flat() || []];
      } else {
        return listOfEdges.flat();
      }
    }, []);

    setNodesList(incomingNodes);
    incomingEdges.forEach((e: any) => {
      setEdgesList((eds) => addEdge(e, edgesList));
    });
  }
  function generateEdge(newEdge: any) {
    console.log({ newEdges: newEdge });
    setEdgesList((prev: DReactFlowEdge[]) => {
      const targetEdge = prev.find((edge: DReactFlowEdge) => edge.id === newEdge.id);
      console.log('found edge', targetEdge, newEdge);

      return ([...prev.filter((edge: DReactFlowEdge) => edge.id !== newEdge.id), targetEdge]);
    });
  }
  /*
  * Debouncing these, because otherwise it might blow up, especially if we implement group selection
  */
  function moveNode(action: any): void {
    setTimeout(() => {
      const nodeUpdate = action?.[0];
      if (nodeUpdate?.type === 'position' && !nodeUpdate?.dragging) {
        const currentNode = nodesList.find((node: any) => node.id === nodeUpdate?.id);
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
    clearTimeout(undefined);
  }

  return (
    <ReactFlow
      nodes={nodesList} edges={edgesList} nodeTypes={nodeTypes}
      onNodeClick={showEditModal} onNodesChange={moveNode} fitView
      onEdgesChange={generateEdge}
    >
      <Background style={{
        backgroundSize: '100% 100%',
        backgroundBlendMode: 'overlay',
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.grey['400'],
        backgroundImage: `url(${treeBgUrl})`,
        borderRadius: '5px'
      }} />
      <Controls />
    </ReactFlow>
  );
});

export default LayoutFlow;