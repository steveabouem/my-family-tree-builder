import React from 'react';
import { Box } from '@mui/material';

const BoxColumn = ({sx, children}: any) => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', gap:1, ...sx}}>
      {children}
    </Box>
  );
};

export default BoxColumn;