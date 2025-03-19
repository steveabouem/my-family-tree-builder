import React, { useEffect } from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import GenealogyForm from './GenealogyForm';
import GenealogyNarrator from './GenealogyNarrator';
import { useZDispatch } from '@app/hooks';
import { DFormField } from '@components/common/definitions';
import { loadStepFormFieldsAction } from '@app/slices/forms/stepForm';

const GenealogyContainer: React.FC = () => {
  return (
    <Box width="100%">
      <Typography variant='body1'><Trans>story_mode_tree_intro</Trans></Typography>
      <Formik initialValues={{}} onSubmit={(v) => { }}>
        {(props) => (
          <Grid2 container spacing={2} display="flex" justifyContent="space-between">
            <Grid2 size={6} >
              <GenealogyForm />
            </Grid2>
            <Grid2 size={6}>
              <GenealogyNarrator />
            </Grid2>
          </Grid2>
        )}
      </Formik>
    </Box>
  );
}

export default GenealogyContainer;