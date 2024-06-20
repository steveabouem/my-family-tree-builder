import React, { useCallback } from 'react';
import classNames from 'classnames';
import type { ExtNode } from 'relatives-tree/lib/types';

interface FamilyNodeProps {
  node: ExtNode;
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
        <div
          className={`inner ${node.gender} single-node`}
          onClick={clickHandler}
        >
          <div>{node.id}</div>
        </div>
       
      </div>
    );
  },
);

export default FamilyNode