import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Background,
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Controls,
  NodeChange,
  OnNodesChange,
  Node,
  NodeMouseHandler,
} from '@xyflow/react';
import { Box, Button } from '@mui/material';
import '@xyflow/react/dist/style.css';
import CustomNode from './TreeNode';
import generateReactFlowLayout from './utils';
import { DFamilyTreeDTO } from '@services/api.definitions';
import { DReactFlowEdge, DReactFlowNode } from '../definitions';
import FamilyTreeService from 'services/familyTree/familyTree.service';
import { useZDispatch } from 'app/hooks';
import { populateTreeAction } from 'app/slices/trees';
import GlobalContext from 'contexts/creators/global';
import NodeMenu from './NodeMenu';
import { Trans } from '@lingui/macro';

const nodeTypes = {
  custom: CustomNode,
};


const LayoutFlow = memo(({ tree }: { tree: DFamilyTreeDTO }) => {
  const [nodesList, setNodesList] = useState<any>([]);
  const [edgesList, setEdgesList] = useState<any>([]);
  const [showNodeMenu, setShowNodeMenu] = useState<boolean>(false);
  const { updateModal } = useContext(GlobalContext);
  const dispatch = useZDispatch();

  useEffect(() => {
    if (Object.keys(tree)?.length)
      generateNodesAndEdges();
  }, [tree]);

  function showEditModal(event: any, node: any) {
    console.log({ node });

    setTimeout(() => {
      if (updateModal)
        updateModal({
          hidden: false,
          buttons: {
            cancel: true,
            confirm: true
          },
          title: <Trans>choose_node_action_title</Trans>,
          onCancel: () => {
            setShowNodeMenu(false);
          },
          content: <NodeMenu data={node} />,
        });
    }, 500);
  }
  function generateNodesAndEdges() {
    const incomingNodes: any = Object.values(tree);
    const incomingEdges = incomingNodes.reduce((listOfEdges: any, node: any) => {
      // const duplicate = listOfEdges.find((e:any) => e.id === node)
      if (node?.connections?.length) {

        return [...listOfEdges, node.data?.connections?.flat() || []];
      } else {
        return listOfEdges;
      }
    }, []);
    console.log({ incomingEdges });

    setNodesList(incomingNodes);
    setEdgesList(incomingEdges.flat());
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
  function changeNodeContent(c: any) {
    console.log('changeNodeContent', c);
  }
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
      onNodeClick={showEditModal} onNodesChange={moveNode}
    // onConnect={generateEdge} onEdgesChange={generateEdge}      
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
});

export default LayoutFlow;