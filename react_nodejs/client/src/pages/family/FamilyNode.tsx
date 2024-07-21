import React, { useCallback } from 'react';
import type { ExtNode } from 'relatives-tree/lib/types';
import { Card } from 'react-bootstrap';
import { DTreeNode } from '../tree/definitions';
import('../styles/familyNode.styles.scss');
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
    React.useEffect(() => {
      console.log('RECEIVED : ', { node, isRoot });

    }, [isRoot, node])
    return (
      <div className="root" id={node.id} style={style} title={node.id}>
        <div
          className={`inner male ${isRoot ? 'root' : ''}`}
        >
          {/* {node.last_name.split('')[0]} {node.first_name.split('')[0]} */}
        </div>
        {/* {node.hasSubTree && ( // ! TODO: not needed for the first deploy
        <div
          className='sub female'
          onClick={() => onSubClick(node.id)}
        />
      )} */}
      </div>
    );
  },
);

export default FamilyNode