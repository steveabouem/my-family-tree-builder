import React, { ReactNode, useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import { v4 } from "uuid";
import StepForm from "components/common/forms/stepform";
import { useZDispatch, useZSelector } from "app/hooks";
import { clearFieldsByStepName, loadStepFormFieldsAction, setStepsCountAction, updateGlobalValuesAction } from "app/slices/forms/stepForm";
import { DStepFormState } from "@app/slices/definitions";
import GenderDropdown from "components/common/dropdowns/gender/GenderDropdown";
import { maritalStatusOptions, relationOptions } from "components/common/dropdowns/definitions";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";
import { DFormField } from "@components/common/definitions";

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
  const { values, setFieldValue} = useFormikContext<any>();
  const dispatch = useZDispatch();
  const initialFields: DFormField[] =
    [
      { fieldName: "first_name", label: <Trans>first_name</Trans>, },
      { fieldName: "last_name", label: <Trans>last_name</Trans> },
      { fieldName: "marital_status", label: <Trans>marital_status</Trans> },
      { fieldName: "occupation", label: <Trans>occupation</Trans> },
      { fieldName: "dob", label: <Trans>dob</Trans>, type: "date" },
      { fieldName: "gender", label: <Trans>gender</Trans>, subComponent: () => <GenderDropdown name="family_member_gender" /> },
      { fieldName: "email", label: <Trans>email</Trans>, type: "email" },
      { fieldName: "description", label: <Trans>description</Trans> },
    ];

  useEffect(() => {
    // TODO: a nice to have: dropdown to display step number or name above the fields. 
    /*
    * the form will direct user to build the tree one  member at the time
    * for each member, the user will be able to add partners, parents and children (potentially more)
    */
    generateStepforKin(currentFormStep);
  }, [currentFormStep]);

  /*
  * Generate fields for current step
  */
  function generateStepforKin(step: number) {
    const fieldPrefix = step === 1 ? 'anchor' : `${step}`;
    generateKinFields(fieldPrefix, false, false);
  }
  /*
  * was used when form was forcing user to go mother->father->children
  */
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
    // the stepname will likely come from a dropdown or other field's label. they're capitalized
    const lcName = values?.next_of_kin?.toLocaleLowerCase() || stepName; 

    if (reset) {
      dispatch(clearFieldsByStepName(lcName));
    } else {
      /*
      * user might be trying to add to existing step fields, hencewhy we are using the index
      */
      const existingFIelds = edit ? currentFormStepDetails?.fields?.flat() : [];
      const fields = [
        ...existingFIelds || [],
        { fieldName: 
          `${lcName}_first_name`, label: <Trans>first_name</Trans>, value: values?.[`${lcName}_first_name`] || ''},
        { fieldName: `${lcName}_last_name`, label: <Trans>last_name</Trans>, value: values?.[`${lcName}_last_name`] || '' },
        {
          fieldName: `${lcName}_marital_status`, label: <Trans>marital_status</Trans>, subComponent: () => (
            <BaseDropDown
              name={`${lcName}_marital_status`}
              options={maritalStatusOptions}
              id={`${lcName}_marital_status-selection`}
              sx={{ height: '1rem' }}
            />
          ),
          value: values?.[`${lcName}_marital_status`] || ''
        },
        { fieldName: `${lcName}_occupation`, label: <Trans>occupation</Trans>, value: values?.[`${lcName}_occupation`] || '' },
        { fieldName: `${lcName}_dob`, label: <Trans>dob</Trans>, type: "date", value: values?.[`${lcName}_dob`] || '' },
        { fieldName: `${lcName}_gender`, label: <Trans>gender</Trans>, subComponent: () => <GenderDropdown name={`${lcName}_gender`} />,
          value: values?.[`${lcName}_gender`] || '' },
        { fieldName: `${lcName}_email`, label: <Trans>email</Trans>, type: "email", value: values?.[`${lcName}_email`] || '' },
        { fieldName: `${lcName}_description`, label: <Trans>description</Trans>, value: values?.[`${lcName}_description`] || '' },
      ];
      /*
      * Add nodeId to formik values for post request payload
      */
      setFieldValue(`${lcName}_node_id`, v4());
      dispatch(loadStepFormFieldsAction({ name: lcName, fields, title: <Trans>{`info_on_${lcName}`}</Trans> }));
    }
  }
  function addRelative() {
    /*
    * user will select the relative type (kinship) for the next step.
    * this function ensures that 
      * - 1: the  next step has the right prefix
      * - 2: the  current step is setup to receive the values based on kinship. 
      * e.g:  selecting wife/husband fills in current step's node's spouses array.
    */
    dispatch(setStepsCountAction(totalSteps + 1));
  }
  /*
  * The value selected in the relatives dropdown is kept in form.
  * We use that value to identify which kinship array we fill for the current step 
  */
 // TODO: this has a flaw, as the dropdown and the step change are not actually dependant on each other
  function insertRelativeValuesTocurrentMember() {
    const type = values?.next_of_kin;

    // setFieldValue(`${currentFormStepDetails.name}`)
  }

  return (
    <Paper sx={{ padding: '1rem', display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Trans>family_tree_building_explanation</Trans>
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <Typography variant="subtitle2"><Trans>whos_next?</Trans></Typography>
        <BaseDropDown name="next_of_kin" options={relationOptions} sx={{width: '60%'}} />
        <Button variant="outlined" onClick={addRelative}><Trans>confirm</Trans></Button>
      </Box>
      <StepForm handleSave={saveProgress}  />
    </Paper>
  );
};

export default GenealogyForm;