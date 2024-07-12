import React, { useCallback } from 'react';
import type { ExtNode } from 'relatives-tree/lib/types';
import { Card } from 'react-bootstrap';
import { DTreeNode } from './tree/definitions';

interface FamilyNodeProps {
  node: DTreeNode;
  isRoot: boolean;
  isHover?: boolean;
  onClick: (id: string) => void;
  onSubClick: (id: string) => void;
  style?: React.CSSProperties;
}

const FamilyNode = React.memo(
  function FamilyNode({ node, isRoot, isHover, onClick, onSubClick, style }: FamilyNodeProps) {
    const clickHandler = useCallback(() => onClick(node.id), [node.id, onClick]);
    const clickSubHandler = useCallback(() => onSubClick(node.id), [node.id, onSubClick]);

    return (
      <div className="root" style={style} title={node.id}>
        <Card style={{ width: '50px', height: '50px ', borderRadius: '100px' }}>
          <Card.Img variant="top" src={node?.profile_url || ''} />
          <Card.Body>
            <Card.Title>{node.first_name} {node.last_name}</Card.Title>
            <Card.Text>
             {node.age}
             {node.gender}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  },
);

export default FamilyNode