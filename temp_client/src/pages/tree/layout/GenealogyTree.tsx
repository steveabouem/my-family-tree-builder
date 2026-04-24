import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
} from '@xyflow/react';
// @ts-ignore
import '@xyflow/react/dist/style.css';
import CustomNode from './TreeNode'
import CustomEdge from './CustomEdge';
import { FlowComponentTypes } from 'types';

const nodeTypes = {
  [FlowComponentTypes.customNode]: CustomNode,
};
const edgeTypes = {
  [FlowComponentTypes.customEdge]: CustomEdge,
};

const GenealogyTree = ({ initialNodes, initialEdges }: any) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges ?? []);

  useEffect(() => {
    setNodes(initialNodes ?? []);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges ?? []);
  }, [initialEdges, setEdges]);
  const onConnect = useCallback(
    (params: any) => setEdges((els) => addEdge(params, els)),
    [],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      draggable
    >
      <Background />
    </ReactFlow>
  );
};

export default GenealogyTree;
