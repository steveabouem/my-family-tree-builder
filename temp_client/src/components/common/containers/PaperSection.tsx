import React, { ReactNode } from 'react';
import { Paper, useTheme } from '@mui/material';
import styled from 'styled-components';

const PaperSection = ({ children, elevation }: { children: ReactNode, elevation?: number }) => {
  const theme = useTheme();
return (
    <ResponsivePaper sx={{border: "none", background: theme.palette.secondary.main}} elevation={elevation || 0} className='respo-paper'>
      {children}
    </ResponsivePaper>
  )
};

const ResponsivePaper = styled(Paper) <{ fullWidth: boolean }>`
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  margin: auto;
`;

export default PaperSection;