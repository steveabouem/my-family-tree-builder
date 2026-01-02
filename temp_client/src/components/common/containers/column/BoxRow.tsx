import { Box } from '@mui/material';
import React from 'react'

const BoxRow = ({sx, children}: any) => {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1, ...sx }}>
      {children}
    </Box>
  );
};

export default BoxRow;