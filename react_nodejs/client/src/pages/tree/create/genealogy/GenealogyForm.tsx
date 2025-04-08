import React, { useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import {v4 } from "uuid";
import StepForm from "components/common/forms/stepform";
import { useZDispatch, useZSelector } from "app/hooks";
import { clearFieldsByStepName, loadStepFormFieldsAction, setStepsCountAction, updateGlobalValuesAction } from "app/slices/forms/stepForm";
import { DStepFormState } from "@app/slices/definitions";
import GenderDropdown from "components/common/dropdowns/gender/GenderDropdown";
import CustomField from "components/common/forms/customField/CustomField";
import { maritalStatusOptions } from "components/common/dropdowns/definitions";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";

const initialFields =
  [
    { fieldName: "first_name", label: <Trans>first_name</Trans> },
    { fieldName: "last_name", label: <Trans>last_name</Trans> },
    { fieldName: "marital_status", label: <Trans>marital_status</Trans> },
    { fieldName: "occupation", label: <Trans>occupation</Trans> },
    { fieldName: "dob", label: <Trans>dob</Trans>, type: "date" },
    { fieldName: "gender", label: <Trans>gender</Trans>, subComponent: () => <GenderDropdown name="family_member_gender" /> },
    { fieldName: "email", label: <Trans>email</Trans>, type: "email" },
    { fieldName: "description", label: <Trans>description</Trans> },
  ];
const childCountStep = 3; // subject to change, but for now, this is the step where user will be able to add children
/*
* This implementation of the <StepForm /> follows the following logic:
* each step uses a unique name to be identified by the store
* a hook listens to the change in step, and applies the matching fields for that step id, using the generateKinFields function
* if the user modifies the number of steps (eg: increasing the number of siblings), the same function is triggered
* the form is saved in the store until the user decides to submit. Formik handles each step separately, including the validations:
*   user will not be able to switch steps, save or submit until the current step is valid
* should the user want to remove a step (eg: reducing the nubmer of siblings), the unique name is then used to empty the fields for that specific step
* Should the user modify a fields list (eg: adding children or partner to a fields list), Formik will prepopulate the form with the previous values,
*    since adding those new fields will rerendre the form (values will be taken from the store's globalValues, it has all the field names we need)
*/
const GenealogyForm = () => {
  const { totalSteps, currentFormStep, currentFormStepDetails } = useZSelector<DStepFormState>(state => state.stepForm);
  const { values, setFieldValue } = useFormikContext<any>();
  const dispatch = useZDispatch();

  useEffect(() => {
    dispatch(loadStepFormFieldsAction({ name: 'mother', fields: initialFields }));
    dispatch(setStepsCountAction(3));
  }, []);
  useEffect(() => {
    // TODO: a nice to have: dropdown to display step number or name above the fields. 
    /*
    * the form will direct user to build one family unit at the time (parents, children)
    * for each child, the user will be able to add partners and children of their own
    * the naming mother/father here is just meant for parent 1 and parent 2. USer will have the choice to set gender for both
    */
    // 1: mother
    // 2: father
    // 3: children(1) 
    if (currentFormStep)
      generateStepforKin(currentFormStep);
  }, [currentFormStep]);

  /*
  * Generate fields for current step
  */
  function generateStepforKin(step: number) {
    switch (step) {
      case 1:
        generateKinFields('mother', false, false);
        break;
      case 2:
        generateKinFields('father', false, false);
        break;
      case 3:
        generateKinFields('children-1', false, false);
        break;
      default:
        generateKinFields(`children-${step - 2}`, false, false);
    }
  }
  function changeChildrenCount(amount: number) {
    const newStepsTotal = (totalSteps || 0) + Number(amount);

    dispatch(setStepsCountAction(newStepsTotal));
    for (let i = 0; i < amount; i++) {
      generateKinFields(`children-${i}`, false, false);
    }
  }
  /*
  * save each step of the form in redux store
  */
  function saveProgress() {
    dispatch(updateGlobalValuesAction({ values }));
  }
  function generateKinFields(stepName: string, edit: boolean, reset: boolean) {
    if (reset) {
      dispatch(clearFieldsByStepName(stepName));
    } else {
      /*
      * user might be trying to add to existing step fields
      */
      const existingFIelds = edit ? currentFormStepDetails?.fields?.flat() : [];
      const fields = [
        ...existingFIelds || [],
        { fieldName: `${stepName}_first_name`, label: <Trans>first_name</Trans>, value: values?.[`${stepName}_first_name`] || '' },
        { fieldName: `${stepName}_last_name`, label: <Trans>last_name</Trans>, value: values?.[`${stepName}_last_name`] || '' },
        { fieldName: `${stepName}_marital_status`, label: <Trans>marital_status</Trans>, subComponent: () => (
            <BaseDropDown
                name={`${stepName}_marital_status`}
                options={maritalStatusOptions}
                id={`${stepName}_marital_status-selection`}
                sx={{ height: '1rem'}}
              />
        ),
        value: values?.[`${stepName}_marital_status`] || '' },
        { fieldName: `${stepName}_occupation`, label: <Trans>occupation</Trans>, value: values?.[`${stepName}_occupation`] || '' },
        { fieldName: `${stepName}_dob`, label: <Trans>dob</Trans>, type: "date", value: values?.[`${stepName}_dob`] || '' },
        { fieldName: `${stepName}_gender`, label: <Trans>gender</Trans>, subComponent: () => <GenderDropdown name={`${stepName}_gender`} />, value: values?.[`${stepName}_gender`] || '' },
        { fieldName: `${stepName}_email`, label: <Trans>email</Trans>, type: "email", value: values?.[`${stepName}_email`] || '' },
        { fieldName: `${stepName}_description`, label: <Trans>description</Trans>, value: values?.[`${stepName}_description`] || '' },
      ];
      /*
      * Add nodeId to formik values for service request payload
      */
     setFieldValue(`${stepName}_node_id`, v4());
      dispatch(loadStepFormFieldsAction({ name: stepName, fields, title: <Trans>{`info_on_${stepName}`}</Trans> }));
    }
  }

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between" gap={2}>
        {currentFormStep === childCountStep ? (
          <Box display="flex" justifyContent="space-between" flex="1">
            <Typography><Trans>how_many_children</Trans></Typography>
            <CustomField type="number" min={0} onChange={(e: any) => changeChildrenCount(e.target.value)} />
          </Box>
        ) : ''}
      </Box>
      <StepForm handleSave={saveProgress} />
    </Paper>
  );
};

export default GenealogyForm;