import React, { MouseEvent, useCallback } from 'react';
import { div, Col, Container, Image, Row } from 'react-bootstrap';
import { DTreeNode } from '../tree/definitions';

interface DTreeNodeBubbleProps {
  node: any;
  // onClick: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void;
  // onHover: (e: unknown) => void;
}

function TreeNodeBubble({ node}: DTreeNodeBubbleProps) {
  return (
    <div className={'root'} style={{
      width: 70,
      height: 80,
      transform: `translate(${node.left * (70 / 2)}px, ${node.top * (80 / 2)}px)`
    }}>
      <div
        className="inner"
      >
        <div className={'id'}>{node.id}</div>
      </div>
    </div>
  );
}

export default TreeNodeBubble