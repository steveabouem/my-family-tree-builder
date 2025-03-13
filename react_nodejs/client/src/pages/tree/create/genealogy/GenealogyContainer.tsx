import React from 'react';
import { Box, Grid2, Paper, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import GenealogyForm from './GenealogyForm';
import BiographicalSketch from './BiographicalSketch';

const GenealogyContainer: React.FC = () => {
  return (
    <Box>
      <Typography variant='body1'><Trans>story_mode_tree_intro</Trans></Typography>
      <Grid2 container spacing={2}>
          <Grid2 size={5} >
            <GenealogyForm />
          </Grid2>
          <Grid2 size={5}>
            <BiographicalSketch />
          </Grid2>
      </Grid2>
    </Box>
  );
}

export default GenealogyContainer;