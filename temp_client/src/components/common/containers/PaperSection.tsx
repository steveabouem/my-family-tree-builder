import React, { ReactNode } from 'react';
import { Paper } from '@mui/material';
// @ts-ignore
import styled from 'styled-components';
import { useZSelector } from 'app/hooks';
import { ThemeSeasons, ThemeState } from 'types';

const PaperSection = ({ children, elevation, spread }: { children: ReactNode, spread?: boolean, elevation?: number }) => {
  const { season } = useZSelector<ThemeState>(state => state.theme);
  const contentStyles = {
    border: season !== ThemeSeasons.default ? 'none' : '1px solid #005078'
  };

  return (
    <ResponsivePaper sx={contentStyles} elevation={elevation || 0} fullWidth={spread}>
      {children}
    </ResponsivePaper>
  )
};


const ResponsivePaper = styled(Paper) <{ fullWidth: boolean }>`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  width: ${(props: { fullWidth: boolean }) => props.fullWidth ? '100%' : '80%'};
  gap: 1rem;
  margin: auto;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default PaperSection;