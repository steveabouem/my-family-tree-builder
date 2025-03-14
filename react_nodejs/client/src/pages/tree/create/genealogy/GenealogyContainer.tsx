import React from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import GenealogyForm from './GenealogyForm';
import BiographicalSketch from './BiographicalSketch';

const GenealogyContainer: React.FC = () => {
  return (
    <Box width="100%">
      <Typography variant='body1'><Trans>story_mode_tree_intro</Trans></Typography>
      <Grid2 container spacing={2} display="flex" justifyContent="space-between">
          <Grid2 size={6} >
            <GenealogyForm />
          </Grid2>
          <Grid2 size={6}>
            <BiographicalSketch />
          </Grid2>
      </Grid2>
    </Box>
  );
}

export default GenealogyContainer;