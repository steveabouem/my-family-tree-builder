import React from 'react';
import { Box } from '@mui/material';
import styled from 'styled-components';

const BoxRow = ({ sx, children, hasCustomStyles = false, styledProps }: any) => {

  if (hasCustomStyles) {
    const Comp = styled(Box)` ${styledProps}`;

    return (
      <Comp sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1, ...sx }}>
        {children}
      </Comp>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1, ...sx }}>
      {children}
    </Box>
  );
};

export default BoxRow;