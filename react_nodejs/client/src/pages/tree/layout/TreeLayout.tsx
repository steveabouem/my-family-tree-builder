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
} from '@xyflow/react';
import { Box, Button } from '@mui/material';
import '@xyflow/react/dist/style.css';
import CustomNode from './TreeNode';
import generateReactFlowLayout from './utils';
import { DFamilyMemberDTO, DFamilyTreeDTO } from '@services/api.definitions';
import { DReactFlowEdge, DReactFlowNode } from '../definitions';

const nodeTypes = {
  custom: CustomNode,
};


const LayoutFlow = memo(({ tree }: { tree: DFamilyTreeDTO }) => {
  const [nodes, setNodes] = useState<any>([]);
  const [edges, setEdges] = useState<any>([]);

  useEffect(() => {
    if (Object.keys(tree)?.length)
      populateInitialNodes();

  }, [tree]);
  // useEffect(() => {
  //   positionNodesByKinship();
  // }, [nodes.length]);


  function populateInitialNodes() {
    const origin = { x: 0, y: 0 };
    const newNodes = Object.values(tree);

    const updates = newNodes.reduce((nodes: any, node: any, index: number) => {
      const position = {
        x: index * 10,
        y: 0
      };
      const 
      return ([
        ...nodes, {
          ...node,
          position,
          data: { label: node.label }
        }
      ]);

    }, [])
    setNodes(updates);
  }
  // function positionNodesByKinship() {
  //   console.log('init position algorythm');
    
  //   const newNodePositions = nodes.map((currentNode: any) => {
  //     const updates = newNodes.map((currentNode: any) => {
  //       /*
  //       * each node in the tree refers to a family member's data, including kinship
  //       */
  //       let kids: any = [];
  //       let siblings: any = [];
  //       let spouses: any = [];
  //       /*
  //        * find all the treeNode children,  position them below it, then populate the matching kinship array
  //        */
  //       const childrenNodes = nodeList.filter((node: any) => currentNode?.children?.includes(node.id)) || [];
  //       kids = [...kids, ...childrenNodes.map((child: any) => {
  //         if (kids!.includes(child)) {
  //           return ({ ...child, position: { x: currentNode?.position?.x || 0, y: currentNode?.position?.y + 50 || 0 } });
  //         }
  //       })];
  //       /*
  //        * find the treeNode spouse, and position them adjacent to it, then populate the matching kinship array 
  //        */
  //       const spouseNodes = nodeList.filter((node: any) => currentNode?.spouses?.includes(node.id)) || [];
  //       spouses = [...spouses, ...spouseNodes?.map((spouse: any) => (
  //         { ...spouse, position: { x: currentNode?.position?.x + 1 || 0, y: currentNode?.position?.y || 0 } }
  //       )) || []];
  //       /*
  //        * find all the treeNode siblings, and position them by age, in the same row, then populate the matching kinship array
  //        */
  //       const siblingNodes = nodeList.filter((node: any) => currentNode?.siblings?.includes(node.id));
  //       siblings = [...siblings, ...siblingNodes?.map((sibling: any) => {
  //         if (siblings!.includes(sibling)) {
  //           return ({
  //             ...sibling,
  //             position: { x: currentNode?.position?.x + 1 || 0, y: currentNode?.position?.y || 0 },
  //           })
  //         }
  //       }) || []];
  //   });

  //   console.log({newNodePositions})
  //   return newNodePositions
  // }
  function generateEdge(newEdge: any) {
    console.log({ newEdges: newEdge });
    setEdges((prev: DReactFlowEdge[]) => {
      const targetEdge = prev.find((edge: DReactFlowEdge) => edge.id === newEdge.id);
      console.log('found edge', targetEdge, newEdge);

      return ([...prev.filter((edge: DReactFlowEdge) => edge.id !== newEdge.id), targetEdge]);
    });
  }
  function getNodeContent(c: any) {
    console.log('getNodeContent', c);

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
        const currentNode = nodes.find((node: any) => node.id === nodeUpdate?.id);
        setNodes((prev: any) => {
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
      nodes={nodes} edges={edges} fitView nodeTypes={nodeTypes}
      onNodeClick={getNodeContent} onNodesChange={moveNode}
      onConnect={generateEdge} onEdgesChange={generateEdge}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
});

export default LayoutFlow;