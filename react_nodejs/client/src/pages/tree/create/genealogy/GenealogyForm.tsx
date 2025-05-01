import React, { useEffect } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import { v4 } from "uuid";
import StepForm from "components/common/forms/stepform";
import { useZDispatch, useZSelector } from "app/hooks";
import { clearFieldsByStepName, loadStepFormFieldsAction, setStepsCountAction, updateGlobalValuesAction } from "app/slices/forms/stepForm";
import { DStepFormState } from "@app/slices/definitions";
import FieldAndLabel from "components/common/forms/fieldAndlabel";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";
import { genderOptions, maritalStatusOptions, relationOptions } from "components/common/dropdowns/definitions";

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
    generateStepforKin(1);
  }, []);
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
  * save each step of the form in redux store
  */
  function saveProgress() {
    dispatch(updateGlobalValuesAction({ values }));
  }
  function generateKinFields(stepName: string, edit: boolean, reset: boolean) {
    // the stepname will likely come from a dropdown or other field's label. they're capitalized
    const prefix = currentFormStep > 1 && values?.next_of_kin ? values.next_of_kin.toLocaleLowerCase() + `-${currentFormStep}` : stepName;

    if (reset) {
      dispatch(clearFieldsByStepName(prefix));
    } else {
      /*
      * user might be trying to add to existing step fields, hencewhy we are using the index
      */
      const existingFIelds = edit ? currentFormStepDetails?.fields?.flat() : [];
      const fields = [
        ...existingFIelds || [],
        {
          fieldName:
            `${prefix}_first_name`, label: <Trans>first_name</Trans>, value: values?.[`${prefix}_first_name`] || ''
        },
        { fieldName: `${prefix}_last_name`, label: <Trans>last_name</Trans>, value: values?.[`${prefix}_last_name`] || '' },
        {
          fieldName: `${prefix}_marital_status`, label: <Trans>marital_status</Trans>, subComponent: () => (
            <BaseDropDown
              name={`${prefix}_marital_status`}
              options={maritalStatusOptions}
              id={`${prefix}_marital_status-selection`}
              sx={{ height: '1rem' }}
            />
          ),
          value: values?.[`${prefix}_marital_status`] || ''
        },
        { fieldName: `${prefix}_occupation`, label: <Trans>occupation</Trans>, value: values?.[`${prefix}_occupation`] || '' },
        { fieldName: `${prefix}_dob`, label: <Trans>dob</Trans>, type: "date", value: values?.[`${prefix}_dob`] || '' },
        { fieldName: `${prefix}_dod`, label: <Trans>dod</Trans>, type: "date", value: values?.[`${prefix}_dod`] || '' },
        {
          fieldName: `${prefix}_gender`, label: <Trans>gender</Trans>, subComponent: () => (
            <BaseDropDown
              options={genderOptions} id="gender-selection" name={`${prefix}_gender`}
            />),
          value: values?.[`${prefix}_gender`] || ''
        },
        { fieldName: `${prefix}_email`, label: <Trans>email</Trans>, type: "email", value: values?.[`${prefix}_email`] || '' },
        { fieldName: `${prefix}_description`, label: <Trans>description</Trans>, value: values?.[`${prefix}_description`] || '' },
      ];
      /*
      * Add nodeId to formik values for post request payload
      */
      setFieldValue(`${prefix}_node_id`, v4());
      dispatch(loadStepFormFieldsAction({ name: prefix, fields, title: <Trans>info_on_node {prefix}</Trans> }));
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

  return (
    <Paper sx={{ padding: '1rem', display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Trans>family_tree_building_explanation</Trans>
      <Box display="flex" justifyContent="start" alignItems="center" gap={2}>
        <FieldAndLabel direction="row" fieldName="name" label={<Trans>name_your_tree</Trans>} sx={{ justifyContent: 'start', flex: '1 1 auto' }} fieldStyles={{ marginLeft: 'auto', width: '40%' }} />
        <Button variant="outlined" ><Trans>confirm</Trans></Button>
      </Box>
      <Box display="flex" justifyContent="start" alignItems="center" gap={2}>
        <Typography variant="subtitle2"><Trans>whos_next?</Trans></Typography>
        <BaseDropDown name="next_of_kin" options={relationOptions} sx={{ width: '40%', marginLeft: 'auto' }} />
        <Button variant="outlined" onClick={addRelative}><Trans>confirm</Trans></Button>
      </Box>
      <StepForm handleSave={saveProgress} />
    </Paper>
  );
};

export default GenealogyForm;