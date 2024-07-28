import React, { MouseEvent, useCallback } from 'react';
import { Card, Col, Container, Image, Row } from 'react-bootstrap';
import { DTreeNode } from '../tree/definitions';

interface DTreeNodeBubbleProps {
  node: DTreeNode;
  onClick: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onHover: (e: unknown) => void;
}

function TreeNodeBubble({ node, onClick, onHover }: DTreeNodeBubbleProps) {

  return (
    <Card className="bg-dark text-white">
      <Image roundedCircle src={node?.profile_url || ''} />
      <Card.ImgOverlay>
        <Card.Title>{node?.first_name?.split('')[0] || ''} {node?.last_name?.split('')[0] || ''}</Card.Title>
        <Card.Text>Description</Card.Text>
        <Card.Text>
          {/* {node?.description || ''} */}
        </Card.Text>
      </Card.ImgOverlay>
    </Card>
  );
}

export default TreeNodeBubble