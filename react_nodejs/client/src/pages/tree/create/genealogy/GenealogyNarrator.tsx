import React, { useCallback } from 'react'
import { Paper } from '@mui/material';
import { useFormikContext } from 'formik';
import { useZDispatch, useZSelector } from 'app/hooks';
import { DStepFormState } from 'app/slices/definitions';

export const GenealogyNarrator = () => {
  const { values } = useFormikContext();
  const dispatch = useZDispatch();
  const { currentFormStep, currentFormStepFields, updating } = useZSelector(
    (state: { stepForm: DStepFormState }) => state.stepForm);
  const generativeBio = useCallback((step: number, fieldName: string) => {
    const excerpt = '';
  }, [currentFormStep]);

  return (
    <Paper>
      <></>
    </Paper>
  );
};

export default GenealogyNarrator;