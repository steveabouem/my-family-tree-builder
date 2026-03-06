import React from 'react';
import { Box } from '@mui/material';
import styled from 'styled-components';

const BoxRow = ({ sx, children, hasCustomStyles = false, styledProps }: any) => {

  if (hasCustomStyles) {
    const Comp = renderStyled(styledProps);

    return (
      <Comp sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1,width: '100%', ...sx }}>
        {children}
      </Comp>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 1, width: '100%', ...sx }}>
      {children}
    </Box>
  );
};

const renderStyled = (attr: string) => {
  return styled(Box)` ${attr}`;
};

export default BoxRow;