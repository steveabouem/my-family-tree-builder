import React from 'react'
import { Box, Button, Chip, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import FormFieldsGenerator from '../FormFieldsGenerator';
import { useFormikContext } from 'formik';
import LocalSpinner from 'components/common/progressIndicators/LocalSpinner';
import { StepFormProps,StepFormState } from 'types';
import { useZDispatch, useZSelector } from 'app/hooks';
import { nextFormStepAction, prevFormStepAction } from 'app/slices/forms/stepForm';

// TODO: pass validations as props here, prevent save and submit in case of field errors. as well as current step title and otheres alike
// This will ensure that the redux slice calls the api with no risk 
const StepForm = <V,>({ sx, handleNext, handlePrev, handleSave }: StepFormProps<V>) => {
  // TODO: INVESTIGATE RERENDERES (they happen at every key input)
  const { submitForm } = useFormikContext<V>();
  const { currentFormStep, currentFormStepDetails, updating, totalSteps } = useZSelector(
    (state: { stepForm: StepFormState }) => state.stepForm);
    console.log({currentFormStep});
  const dispatch = useZDispatch();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: '1rem', ...sx }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body1">
          <Trans>current_form_step</Trans>
        </Typography>
        {/* // stepTree starts at 0 in the store */}
        <Chip label={currentFormStep + 1} variant="filled" color="primary" size="small" sx={{ padding: '.5rem', borderRadius: '0.4rem' }} />
      </Box>
      <Box display="flex" justifyContent="flex-start" gap={2} alignItems="center">
        <Box display="flex" flexDirection="column" gap={2} justifyContent="center" width="100%">
          <Typography variant="body1">{currentFormStepDetails?.title}</Typography>
          <Typography variant="body1">{currentFormStepDetails?.subtitle}</Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
          <Button variant="contained" disabled={currentFormStep === 0} color="primary" onClick={() => dispatch(prevFormStepAction())}>
            <Trans>prev</Trans>
          </Button>
          <Button variant="contained" color="primary" onClick={() => dispatch(nextFormStepAction())} disabled={currentFormStep === totalSteps - 1}>
            <Trans>next</Trans>
          </Button>
        </Box>
      </Box>
      {updating ? <LocalSpinner loading /> : (
        <Box>
          <FormFieldsGenerator
            fields={currentFormStepDetails.fields.flat()} handleSubmit={submitForm}
            initialValues={{}} withPaper={false} locked={false}
          />
        </Box>
      )}
    </Box>
  );
};

export default StepForm;