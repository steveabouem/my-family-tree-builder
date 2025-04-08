import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import { DFamilyMemberDTO, DFamilyTreeDTO } from '@services/api.definitions';
import { DReactFlowEdge, DReactFlowNode } from '../definitions';
import FamilyTreeService from 'services/familyTree/familyTree.service';
import { useZDispatch } from 'app/hooks';
import { populateTreeAction } from 'app/slices/trees';

const nodeTypes = {
  custom: CustomNode,
};


const LayoutFlow = memo(({ tree }: { tree: DFamilyTreeDTO }) => {
  const [nodesList, setNodesList] = useState<any>([]);
  const [edgesList, setEdgesList] = useState<any>([]);
  const dispatch = useZDispatch();
  useEffect(() => {
    if (Object.keys(tree)?.length)
      generateNodes();

  }, [tree]);

  function generateNodes() {
    const incomingNodes: any = Object.values(tree);
    setNodesList(incomingNodes);
  }
  function generateEdge(newEdge: any) {
    console.log({ newEdges: newEdge });
    setEdgesList((prev: DReactFlowEdge[]) => {
      const targetEdge = prev.find((edge: DReactFlowEdge) => edge.id === newEdge.id);
      console.log('found edge', targetEdge, newEdge);

      return ([...prev.filter((edge: DReactFlowEdge) => edge.id !== newEdge.id), targetEdge]);
    });
  }
  function getNodeContent(event: any, node: Node): void {
    console.log('getNodeContent', node);

  }
  function changeNodeContent(c: any) {
    console.log('changeNodeContent', c);
  }
  function moveNode(action: any): void {
    /*
    * Debouncing this, because otherwise it might blow up, especially if we implement group selection
    */
    setTimeout(() => {
      const nodeUpdate = action?.[0];
      if (nodeUpdate?.type === 'position' && !nodeUpdate?.dragging) {
        console.log('action', action);

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
      onNodeClick={getNodeContent} onNodesChange={moveNode}
      onConnect={generateEdge} onEdgesChange={generateEdge}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
});

export default LayoutFlow;