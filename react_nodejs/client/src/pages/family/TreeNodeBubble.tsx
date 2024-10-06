import React, { MouseEvent, useCallback } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { DTreeNode } from '../tree/definitions';


interface DTreeNodeBubbleProps {
  node: any;
  // onClick: (e: MouseEvent<HTMLDivElement, MouseEvent>) => void;
  // onHover: (e: unknown) => void;
}

function TreeNodeBubble({ node }: DTreeNodeBubbleProps) {
  const [displayMiniForm, setDisplayMiniForm] = React.useState<boolean>(false);

  return (
    <div className={'root'} style={{
      width: 170,
      height: 180,
      transform: `translate(${node.left * (170 / 2)}px, ${node.top * (180 / 2)}px)`,
      cursor: 'pointer'
    }}
      onClick={() => setDisplayMiniForm(!displayMiniForm)}
    >
      <img src={node?.profile_url || ''} />
      <div
        className="inner"
      >
        <div className={'id'}>{node.first_name}</div>
      </div>
    </div>
  );
}

export default TreeNodeBubble