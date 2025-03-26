import React, { useCallback, useState } from 'react'
import { Box, Paper, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useZDispatch, useZSelector } from 'app/hooks';
import { DStepFormState } from 'app/slices/definitions';
import { Trans } from '@lingui/macro';
import { DFamilyTreeDAO } from '@services/api.definitions';

export const GenealogyNarrator = () => {
  const [paragraphs, setParagraphs] = useState<DFamilyTreeDAO[]>([]);
  const { values } = useFormikContext();
  const dispatch = useZDispatch();
  const { currentFormStep, currentFormStepDetails, updating } = useZSelector(
    (state: { stepForm: DStepFormState }) => state.stepForm);

  React.useEffect(() => {
    generateNarrationBlock(currentFormStep);
  }, [currentFormStep, currentFormStepDetails]);

  function generateNarrationBlock(step: number) {
    const excerpt = '';
    

  }

  return (
    <Paper>
      {paragraphs.map((p: DFamilyTreeDAO) => {
        return (
          <Box>
            <Typography variant="subtitle1"><Trans>relatives_name</Trans></Typography>
            <Typography>{}</Typography>
          </Box>
        );
      })}
    </Paper>
  );
};

export default GenealogyNarrator;