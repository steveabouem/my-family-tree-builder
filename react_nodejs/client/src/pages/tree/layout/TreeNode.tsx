import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Typography } from '@mui/material';

export default memo(({ node }: any) => {
  console.log('in node compo',node);

  return (
    <Box
      width="250px" height="100%"
      display="flex" flexDirection="column" gap={2}
      justifyContent="center" alignItems="center" bgcolor="#d39a49"
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
        isConnectable={true}
      />
      <Typography variant="body2">{node?.data?.label || ''}</Typography>
      <Box width="100%" height="80%" overflow="hidden scroll" position="relative">
        <Box style={{ border: '1px solid', borderRadius: '50px', height: '25px', width: '25px' }}>
          <img src={node?.profile_url || ''} style={{ position: 'absolute', top: '0', left: '5px' }} />PROFILE PIC
        </Box>
      </Box>
    </Box>
  );
});