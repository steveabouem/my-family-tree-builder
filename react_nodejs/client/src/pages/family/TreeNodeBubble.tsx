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
    <Card style={{ width: '150px', height: '150px', borderRadius: '300px', background: '#d59949', border: '2px solid white' }}>
      <Image roundedCircle src={node?.profile_url || ''} height={'30%'} width={'30%'} style={{ border: '2px solid', background: 'white' }} />
      {/* <Card.Title color='secondary'>{node?.first_name || ''}</Card.Title> */}
      <Card.Text style={{ overflow: 'hidden', height: '50%', textAlign: 'center' }}>
        <p>
          {node?.first_name || ''}
        </p>
        <p>
          {node?.description || ''}
        </p>
      </Card.Text>
    </Card>
  );
}

export default TreeNodeBubble