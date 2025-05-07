import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import '@xyflow/react/dist/style.css';
import CustomNode from './TreeNode';
import { DFamilyTreeDTO } from '@services/api.definitions';
import { DReactFlowEdge, DReactFlowNode } from '../definitions';
import { useZDispatch } from 'app/hooks';
import GlobalContext from 'contexts/creators/global';
import NodeMenu from './NodeMenu';
import { setStepsCountAction, updateGlobalValuesAction, changeModeAction } from 'app/slices/forms/stepForm';
import abstractLogo from 'utils/assets/images/abstract_logo.png';
import { stepFormModes } from 'app/slices/definitions';

const nodeTypes = {
  custom: CustomNode,
};
enum nodeMenuActions {
  edit = 'edit_node',
  add = 'add_node_relative',
  delete = 'delete',
};

const LayoutFlow = memo(({ tree }: { tree: DFamilyTreeDTO }) => {
  const [nodesList, setNodesList] = useNodesState<any>([]);
  const [edgesList, setEdgesList] = useEdgesState<any>([]);
  const { setValues } = useFormikContext<any>();
  const { updateModal } = useContext(GlobalContext);
  const dispatch = useZDispatch();

  useEffect(() => {
    if (Object.keys(tree)?.length)
      generateNodesAndEdges();
  }, [tree]);

  function populateFormWithNodeValues(node: DReactFlowNode) {
    setValues({
      anchor_first_name: node?.first_name || '',
      anchor_last_name: node?.last_name || '',
      anchor_occupation: node?.occupation || '',
      anchor_dob: node?.dob || '',
      anchor_dod: node?.dod || '',
      anchor_email: node?.email || '',
      anchor_description: node?.description || '',
      anchor_gender: node.gender,
      anchor_marital_status: node.marital_status,
      anchor_node_id: node.node_id,
      parents: JSON.parse(node?.parents || '[]'),
      siblings: JSON.parse(node?.siblings || '[]'),
      spouses: JSON.parse(node?.spouses || '[]'),
      children: JSON.parse(node?.children || '[]'),
    });
  }
  function showEditModal(event: any, node: DReactFlowNode) {
    updateModal({
      hidden: false,
      buttons: {
        cancel: true,
        confirm: true
      },
      title: <Trans>choose_node_action_title {node.first_name}</Trans>,
      onConfirm: (transferData: string) => {
        switch (transferData) {
          case nodeMenuActions.edit:
            dispatch(changeModeAction(stepFormModes.edit));
            dispatch(updateGlobalValuesAction({ values: {} }));
            populateFormWithNodeValues(node);
            dispatch(setStepsCountAction(1));
            break;
          case nodeMenuActions.add:

            break;
          case nodeMenuActions.delete:
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
      // const duplicate = listOfEdges.find((e:any) => e.id === node)
      console.log('the connections: ', node?.data?.connections);

      if (node?.data?.connections?.length) {
        return [...listOfEdges.flat(), node.data?.connections?.flat() || []];
      } else {
        return listOfEdges.flat();
      }
    }, []);
    console.log({ incomingEdges });

    setNodesList(incomingNodes);
    // incomingEdges.forEach((e: any) => {
    //   setEdgesList((eds) => addEdge(e, edgesList));
    // });
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
      onNodeClick={showEditModal} onNodesChange={moveNode} fitView={true}
    // onConnect={generateEdge} onEdgesChange={generateEdge}      
    >
      <Background style={{
        backgroundSize: '100% 100%',
        backgroundBlendMode: 'overlay',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff6f6c9',
        backgroundImage: `url(${abstractLogo})`,
        borderRadius: '5px'
      }} />
      <Controls />
    </ReactFlow>
  );
});

export default LayoutFlow;