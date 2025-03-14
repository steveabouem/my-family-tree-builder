import React, { useState } from 'react'
import { Box, Button, Chip, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import FormFieldsGenerator from '../FormFieldsGenerator';
import { DStepForm } from './definitions';
import { useFormikContext } from 'formik';
import LocalSpinner from 'components/common/LocalSpinner';

const StepForm = <V,>({ currentStep, currentFields, updateStep, sx }: DStepForm) => {
  const [updating, setUpdating] = useState<boolean>(true);
  const { submitForm } = useFormikContext<V>();

  function swtichStep(direction: 'prev' | 'next') {
    setUpdating(true);
    if (direction === "prev") {
      updateStep(currentStep - 1);
    } else {
      updateStep(currentStep + 1);
    }
    setUpdating(false);
  }

  return (
    <Box sx={sx}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" justifyContent="flex-start" gap={2} alignItems="center">
          <Typography variant="caption">
            <Trans>current_form_step</Trans>
          </Typography>
            <Chip label={currentStep} variant="filled" color="info" size="small" />
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Button variant="contained" color="secondary" onClick={() => swtichStep('prev')}>
            <Typography variant="button"><Trans>prev</Trans></Typography>
          </Button>
          <Button variant="contained" color="secondary" onClick={() => swtichStep('next')}>
            <Typography variant="button"><Trans>next</Trans></Typography>
          </Button>
        </Box>
      </Box>
      {updating ? <LocalSpinner loading /> : (
        <Box>
          <FormFieldsGenerator fields={currentFields} handleSubmit={submitForm} initialValues={{}} withPaper={false} />
        </Box>
      )}
    </Box>
  );
};

export default StepForm;