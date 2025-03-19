import React from 'react'
import { Box, Button, Chip, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import FormFieldsGenerator from '../FormFieldsGenerator';
import { DStepForm } from './definitions';
import { useFormikContext } from 'formik';
import LocalSpinner from 'components/common/LocalSpinner';
import { DStepFormState } from 'app/slices/definitions';
import { useZDispatch, useZSelector } from 'app/hooks';
import { fetchNextStepFields, nextFormStepAction, prevFormStepAction } from 'app/slices/forms/stepForm';

const StepForm = <V,>({  sx, handleNext, handlePrev }: DStepForm) => {
  const { submitForm } = useFormikContext<V>();
  const { currentFormStep, currentFormStepFields, updating} = useZSelector(
    (state: {stepForm: DStepFormState}) => state.stepForm);
  const dispatch = useZDispatch();

  return (
    <Box sx={sx}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" justifyContent="flex-start" gap={2} alignItems="center">
          <Typography variant="caption">
            <Trans>current_form_step</Trans>
          </Typography>
            <Chip label={currentFormStep} variant="filled" color="info" size="small" />
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Button variant="contained" color="secondary" onClick={() => dispatch(fetchNextStepFields(currentFormStep - 1))}>
            <Trans>prev</Trans>
          </Button>
          <Button variant="contained" color="secondary" onClick={() => dispatch(fetchNextStepFields(currentFormStep + 1))}>
            <Trans>next</Trans>
          </Button>
        </Box>
      </Box>
      {updating ? <LocalSpinner loading /> : (
        <Box>
          <FormFieldsGenerator 
            fields={currentFormStepFields} handleSubmit={submitForm} 
            initialValues={{}} withPaper={false} 
          />
        </Box>
      )}
    </Box>
  );
};

export default StepForm;