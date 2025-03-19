import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { Formik, useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import StepForm from "components/common/forms/stepform";
import { useZDispatch, useZSelector } from "app/hooks";
import { DFormField } from "@components/common/definitions";
import { loadStepFormFieldsAction } from "app/slices/forms/stepForm";
import { DStepFormState } from "@app/slices/definitions";

const GenealogyForm = () => {
  const { currentFormStep} = useZSelector((state: {stepForm: DStepFormState}) => state.stepForm);
  const {setValues, values} = useFormikContext();
  const dispatch = useZDispatch();
  const initialFields: DFormField[] = [
    { fieldName: "mother_first", label: <Trans>your_mothers_first_name</Trans> },
    { fieldName: "mother_last", label: <Trans>your_mothers_last_name</Trans> },
    { fieldName: "mother_spouse", label: <Trans>your_mothers_spouse</Trans> },
  ];

  useEffect(() => {
    dispatch(loadStepFormFieldsAction(initialFields));
  }, []);
 

  return (
    <Paper>
      <StepForm />
    </Paper>
  );
};

export default GenealogyForm;