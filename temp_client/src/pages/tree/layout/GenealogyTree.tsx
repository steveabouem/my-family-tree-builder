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
import CustomEdge, { SiblingEdge, SpouseEdge } from './CustomEdge';
import { FlowComponentTypes } from 'types';
import ExpandableNode from './ExpandableNode';

const nodeTypes = {
  [FlowComponentTypes.expandableNode]: ExpandableNode,
};
const edgeTypes = {
  [FlowComponentTypes.customEdge]: CustomEdge,
  [FlowComponentTypes.spouseEdge]: SpouseEdge,
  [FlowComponentTypes.siblingEdge]: SiblingEdge,
};

const GenealogyTree = ({ nodes, edges, handleNodesChange, handleEdgesChange }: any) => {

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      // onConnect={onConnect}
      fitView
      draggable
    >
      <Background />
    </ReactFlow>
  );
};

export default GenealogyTree;
