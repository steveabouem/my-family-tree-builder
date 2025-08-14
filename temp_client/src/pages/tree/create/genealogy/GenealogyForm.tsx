import React, { useContext, useEffect, useMemo } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import { v4 } from "uuid";
import StepForm from "components/common/forms/stepform";
import { useZDispatch, useZSelector } from "app/hooks";
import { clearFieldsByStepName, loadStepFormFieldsAction, populateStepAction, setStepsCountAction, updateGlobalValuesAction } from "app/slices/forms/stepForm";
import {resetAction} from "app/slices/trees";
import { DStepFormState, stepFormModes } from "app/slices/definitions";
import FieldAndLabel from "components/common/forms/fieldAndlabel";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";
import { genderOptions, maritalStatusOptions, relationOptions } from "components/common/dropdowns/definitions";
import GlobalContext from "contexts/creators/global";
import { NodeMenuActions } from "pages/tree/definitions";

/*
* This implementation of the <StepForm /> follows the following logic:
* each step uses a unique name to be identified by the store
* a hook listens to the change in step, and applies the matching fields for that step name, using the generateKinFields function
* if the user modifies the number of steps (eg: increasing the number of siblings), the same function is triggered
* the form is saved in the store until the user decides to submit. Formik handles each step separately, including the validations:
*   user will not be able to switch steps, save or submit until the current step is valid
* should the user want to remove a step (eg: reducing the nubmer of siblings), the unique name is then used to empty the fields for that specific step
* Should the user modify a fields list (eg: adding children or partner to a fields list), Formik will prepopulate the form with the previous values,
*    since adding those new fields will rerendre the form (values will be taken from the store's globalValues, it has all the field names we need)
*/
// @ts-ignore
const GenealogyForm = ({ setTreeCopy, treeCopy }) => {
  const { totalSteps, currentFormStep, stepTree, mode } = useZSelector<DStepFormState>(state => state.stepForm);
  const { values, setFieldValue, setValues } = useFormikContext<any>();
  const { modal} = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const isEditMode = useMemo(() => mode === stepFormModes.edit, [mode]);

  useEffect(() => {
    generateFieldsForRelative(0, false);
  }, []);
  useEffect(() => {
    // TODO: a nice to have: dropdown to display step number or name above the fields. 
    /*
    * the form will direct user to build the tree one  member at the time
    * for each member, the user will be able to add partners, parents and children (potentially more)
    */
    generateFieldsForRelative(currentFormStep, false);
  }, [currentFormStep]);
  useEffect(() => {
    if (modal?.transferData === NodeMenuActions.edit) {
      setValues({});
      dispatch(updateGlobalValuesAction({values: {}}));
    }
  }, [modal?.transferData])

  function resetAll() {
    setValues({});
    dispatch(updateGlobalValuesAction({values: {}}));
    dispatch(resetAction());
  }
  /*
  * save each step of the form in redux store
  */
  function saveProgress() {
    dispatch(updateGlobalValuesAction({ values }));
  }
  function generateFieldsForRelative(stepNumber: number, reset: boolean) {
    /*
    * listener for user changing step in the form
    * step change can only happen if step name has already been set through addRelative function
    * 0 - find the index in the store that matches the step number provided
    * 1 - check if fields have already been created for this step name, i.e if user had already generated this step in the past and is just currently coming back to it
    * 2 - if existing fields, display them, no further actions
    * 3 - if no existing fields, proceed with function execution
    */

    /* 
    * this causes a problem because when you add a kin to a random node in the tree, it messes with the index.
    * Thats because you remove all the indexes and use the selecte node as an anchor, and add the new kin as the next step.
    * in other words, if step 2 had previously existed in the slice, regardless of what kin youre trying to add, it will match with whatever that step 2 was in the slice
    * adding id in the store dosnt change anything since you would need to know the id from within this component to check in the store what it refers to. 
    * an alternative is to ave a state property that gets updated every time the next_of_kin value is confirmed,
    * since when that happens the new kin is added as the last step you can then cross reference that object to determine the value of matchingSteNameInTree. 
    * It should work as long as you make sure to update is when you go in edit mode (press confirm in the modal)
    */
    //  @ts-ignore
    const matchingStepNameInTree =  isEditMode ? treeCopy[stepNumber] : Object.keys(stepTree || {})
      .find(((key: string, index: number) => index === stepNumber));
    const nameOfStep = matchingStepNameInTree || "anchor";
    const fieldsInTree = stepTree?.[nameOfStep];

    if (fieldsInTree?.length) {
      dispatch(loadStepFormFieldsAction({ name: nameOfStep, fields: stepTree?.[nameOfStep] || [], title: <Trans>info_on_node {nameOfStep}</Trans> }));
      return;
    }

    if (reset) {
      dispatch(clearFieldsByStepName(nameOfStep));
    } else {
      const fields = [
        {
          fieldName:
            `${nameOfStep}_firstName`, label: <Trans>firstName</Trans>, value: values?.[`${nameOfStep}_firstName`] || ''
        },
        { fieldName: `${nameOfStep}_lastName`, label: <Trans>lastName</Trans>, value: values?.[`${nameOfStep}_lastName`] || '' },
        {
          fieldName: `${nameOfStep}_marital_status`, label: <Trans>marital_status</Trans>, subComponent: () => (
            <BaseDropDown
              name={`${nameOfStep}_marital_status`}
              options={maritalStatusOptions}
              id={`${nameOfStep}_marital_status-selection`}
              sx={{ height: '1rem' }}
            />
          ),
          value: values?.[`${nameOfStep}_marital_status`] || ''
        },
        { fieldName: `${nameOfStep}_occupation`, label: <Trans>occupation</Trans>, value: values?.[`${nameOfStep}_occupation`] || '' },
        { fieldName: `${nameOfStep}_dob`, label: <Trans>dob</Trans>, type: "date", value: values?.[`${nameOfStep}_dob`] || '' },
        { fieldName: `${nameOfStep}_dod`, label: <Trans>dod</Trans>, type: "date", value: values?.[`${nameOfStep}_dod`] || '' },
        {
          fieldName: `${nameOfStep}_gender`, label: <Trans>gender</Trans>, subComponent: () => (
            <BaseDropDown
              options={genderOptions} id="gender-selection" name={`${nameOfStep}_gender`}
            />),
          value: values?.[`${nameOfStep}_gender`] || ''
        },
        { fieldName: `${nameOfStep}_email`, label: <Trans>email</Trans>, type: "email", value: values?.[`${nameOfStep}_email`] || '' },
        { fieldName: `${nameOfStep}_description`, label: <Trans>description</Trans>, value: values?.[`${nameOfStep}_description`] || '' },
      ];
      /*
      * Add nodeId to formik values for post request payload
      */
     const newNodeId = v4();

      setFieldValue(`${nameOfStep}_node_id`, newNodeId);

      if (nameOfStep === 'anchor') {
        setFieldValue('anchorNode', newNodeId )
      }
      dispatch(loadStepFormFieldsAction({ name: nameOfStep, fields, title: <Trans>info_on_node {nameOfStep}</Trans> }));
    }
  }
  function addRelative() {
    /*
    * user will select the relative type (kinship) for the next step.
    * this function ensures that 
      * - 1: Adds an additional step at the end of the list
      * - 2: assign right prefixto that step, without creating the fields
      * - 3: the  current step is setup to receive the values based on stepname mapping. 
    */
    dispatch(setStepsCountAction(totalSteps + 1));
    dispatch(populateStepAction({ name: `${values.next_of_kin}-${totalSteps}`, fields: [], step: totalSteps + 1 }));
    if (isEditMode) 
    //   this does allow to get the new node name for the next stepFormModes, but upon sumbission,
    //  there are a lot of empty objects that seem to be replacing previously generated kinships. Investigate the formattingOutgoingValues. The issue might be there
      setTreeCopy({ ...treeCopy, [`${totalSteps}`]: values.next_of_kin });
  }

  return (
    <Paper sx={{ flexDirection: "column" }}>
      <Typography variant="body2"><Trans>family_tree_building_explanation</Trans></Typography>
      <Box display="flex" justifyContent="start" alignItems="center" gap={2}>
        <FieldAndLabel direction="row" fieldName="treeName" label={<Trans>name_your_tree</Trans>} sx={{ justifyContent: 'start', flex: '1 1 auto' }} fieldStyles={{ marginLeft: 'auto', width: '40%' }} />
        <Button variant="contained" color="secondary" ><Trans>confirm</Trans></Button>
      </Box>
      <Box display="flex" justifyContent="start" alignItems="center" gap={2}>
        <Typography variant="subtitle2"><Trans>whos_next?</Trans></Typography>
        <BaseDropDown name="next_of_kin" options={relationOptions} sx={{ width: '40%', marginLeft: 'auto' }} />
        <Button variant="contained" color="secondary" onClick={addRelative}><Trans>confirm</Trans></Button>
      </Box>
      <StepForm handleSave={saveProgress} />
    </Paper>
  );
};

export default GenealogyForm;