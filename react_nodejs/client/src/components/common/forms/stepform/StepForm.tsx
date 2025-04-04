import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Chip, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import FormFieldsGenerator from '../FormFieldsGenerator';
import { DStepForm } from './definitions';
import { useFormikContext } from 'formik';
import LocalSpinner from 'components/common/LocalSpinner';
import { DStepDetails, DStepFormState } from 'app/slices/definitions';
import { useZDispatch, useZSelector } from 'app/hooks';
import { fetchNextStepFields, nextFormStepAction, prevFormStepAction } from 'app/slices/forms/stepForm';
import { DFormField } from '@components/common/definitions';

// TODO: pass validations as props here, prevent save and submit in case of field errors. as well as current step title and otheres alike
// This will ensure that the redux slice calls the api with no risk 
const StepForm = <V,>({ sx, handleNext, handlePrev, handleSave }: DStepForm<V>) => {
  const [showNextStep, setShowNextStep] = useState<boolean>(false);
  const [currentFields, setCurrentFields] = useState<DFormField[]>([]);
  const { submitForm, values } = useFormikContext<V>();
  const { currentFormStep, currentFormStepDetails, updating, totalSteps } = useZSelector(
    (state: { stepForm: DStepFormState }) => state.stepForm);
  const dispatch = useZDispatch();
  const isLastStep = useMemo(() => currentFormStep === totalSteps, [totalSteps, currentFormStep]);
  /*
  * Some step forms will need several arrays of fields in the same category (exp:the secion for siblings)
  * to allow the step form to be more dynamic, we will use an object to store the fields for each step
  */
  useEffect(() => {
    if (totalSteps && currentFormStep >= totalSteps) {
      setShowNextStep(false);
    } else {
      setShowNextStep(true);
    }
  }, [totalSteps,currentFormStep]);
  useEffect(() => setCurrentFields(currentFormStepDetails?.fields?.flat()), [currentFormStepDetails]);
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", ...sx }}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" justifyContent="flex-start" gap={2} alignItems="center">
          <Typography variant="body1">
            <Trans>current_form_step</Trans>
          </Typography>
          <Chip label={currentFormStep} variant="filled" color="primary" size="small" sx={{ padding: '.5rem', borderRadius: '0.4rem' }} />
        </Box>
        <Box display="flex" flexDirection="column" gap={2} justifyContent="center" width="100%">
          {currentFormStepDetails?.title}
          {currentFormStepDetails?.subtitle}
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
          <Button variant="contained" color="secondary" onClick={() => dispatch(prevFormStepAction())}>
            <Trans>prev</Trans>
          </Button>
          <Button variant="contained" color="secondary" onClick={() => dispatch(nextFormStepAction())} disabled={!showNextStep}>
            <Trans>next</Trans>
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSave}>
            <Trans>save</Trans>
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setShowNextStep(false)}>
            <Trans>finish</Trans>
          </Button>
        </Box>
      </Box>
      {updating ? <LocalSpinner loading /> : (
        <Box>
          <FormFieldsGenerator
            fields={currentFields} handleSubmit={submitForm}
            initialValues={{}} withPaper={false} locked={false}
          />
        </Box>
      )}
    </Box>
  );
};

export default StepForm;