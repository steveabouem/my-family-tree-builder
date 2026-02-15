import React, { ReactNode } from 'react';
import { Paper } from '@mui/material';
import styled from 'styled-components';
import { useZSelector } from 'app/hooks';
import { ThemeSeasons, ThemeState } from 'types';

const PaperSection = ({ children, elevation }: { children: ReactNode, elevation?: number }) => {
  const { season } = useZSelector<ThemeState>(state => state.theme);
  const contentStyles = {
    border: season !== ThemeSeasons.default ? 'none' : '1px solid #005078'
  };

  return (
    <ResponsivePaper sx={contentStyles} elevation={elevation || 0}>
      {children}
    </ResponsivePaper>
  )
};

const ResponsivePaper = styled(Paper) <{ fullWidth: boolean }>`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  margin: auto;
`;

export default PaperSection;