import React from 'react';
import { Box } from '@mui/material';

interface TreeNodeBubbleProps {
  node: any;
  // onClick: (e: MouseEvent<HTMLBoxElement, MouseEvent>) => void;
  // onHover: (e: unknown) => void;
}

function TreeNodeBubble({ node }: DTreeNodeBubbleProps) {
  const [displayMiniForm, setDisplayMiniForm] = React.useState<boolean>(false);

  return (
    <Box className={'root'} sx={{
      width: 170,
      height: 180,
      transform: `translate(${node.left * (170 / 2)}px, ${node.top * (180 / 2)}px)`,
      cursor: 'pointer'
    }}
      onClick={() => setDisplayMiniForm(!displayMiniForm)}
    >
      <img src={node?.profile_url || ''} />
      <Box
        className="inner"
      >
        <Box className={'id'}>{node.firstName}</Box>
      </Box>
    </Box>
  );
}

export default TreeNodeBubble