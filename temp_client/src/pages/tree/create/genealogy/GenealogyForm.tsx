import React, { useContext, useEffect, useMemo } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import { v4 } from "uuid";
import StepForm from "components/common/forms/stepform";
import { useZDispatch, useZSelector } from "app/hooks";
import { clearFieldsByStepName, loaStepFormFieldsAction, setStepFieldsAction, setStepsCountAction, updateGlobalValuesAction } from "app/slices/forms/stepForm";
import FieldAndLabel from "components/common/forms/fieldAndlabel";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";
import GlobalContext from "contexts/creators/global";
import { StepFormState, stepFormModes, genderOptions, maritalStatusOptions, relationOptions, NodeMenuActions, FormField, FamilyTreeFormData } from "types";


// @ts-ignore
const GenealogyForm = ({ setTreeCopy, treeCopy }) => {
  const { totalSteps, currentFormStep, stepTree, mode } = useZSelector<StepFormState>(state => state.stepForm);
  const { values, setFieldValue, setValues } = useFormikContext<FamilyTreeFormData>();
  const { modal } = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const isEditMode = useMemo(() => mode === stepFormModes.edit, [mode]);

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
      dispatch(updateGlobalValuesAction({ values: {} }));
    }
  }, [modal?.transferData])

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
    * Thats because you remove all the indexes and use the selected node as an anchor, and add the new kin as the next step.
    * in other words, if step 2 had previously existed in the slice, regardless of what kin youre trying to add, 
    * it will match with whatever that step 2 was in the slice. adding id in the store dosnt change anything since you would need to know
    * the id from within this component to check in the store what it refers to. 
    * an alternative is to ave a state property that gets updated every time the next_of_kin value is confirmed,
    * since when that happens the new kin is added as the last step you can then cross reference that object to determine the value of matchingSteNameInTree. 
    * It should work as long as you make sure to update it when you go in edit mode (press confirm in the modal)
    */
    //  @ts-ignore
    const matchingStepNameInTree = isEditMode ? treeCopy[stepNumber] : Object.keys(stepTree || {})
      .find(((key: string, index: number) => index === stepNumber));
    const nameOfStep = matchingStepNameInTree || "anchor";
    const fieldsInTree = stepTree?.[nameOfStep];

    if (fieldsInTree?.length) {
      dispatch(loaStepFormFieldsAction({ name: nameOfStep, fields: stepTree?.[nameOfStep] || [], title: <Trans>info_on_node {nameOfStep}</Trans> }));
      return;
    }

    if (reset) {
      dispatch(clearFieldsByStepName(nameOfStep));
    } else {
      const fields: FormField[] = [
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

      if (nameOfStep === 'anchor' || currentFormStep === 1 && !values?.anchor_node_id) {
        setFieldValue('anchor_node_id', newNodeId)
      }
      dispatch(loaStepFormFieldsAction({ name: nameOfStep, fields, title: <Trans>info_on_node {nameOfStep}</Trans> }));
    }
  }
  function addRelative() {
    /*
    * user will select the relative type (kinship) for the next step.
    */
    //1: Adds an additional step at the end of the list
    dispatch(setStepsCountAction(totalSteps + 1));
    //2: assign right prefixto that step, without creating the fields
    dispatch(setStepFieldsAction({ name: `${values.next_of_kin}-${totalSteps}`, fields: [], step: totalSteps + 1 }));

    if (isEditMode) {
      setTreeCopy({ ...treeCopy, [`${totalSteps}`]: values.next_of_kin });
    }
  }
  // you are adding an extra empty array when selecting edit in the modal. That extra step currently doesnt get the fields loaded. 
  // If you fix that, you will be one step closer to fixing the issue of haveing a ghost member when submitting edit tree
  return (
    <Paper sx={{ flexDirection: "column" }}>
      <Typography variant="body2"><Trans>family_tree_building_explanation</Trans></Typography>
      <Box sx={treeNameContainerStyle}>
        <FieldAndLabel direction="row" fieldName="treeName" label={<Trans>name_your_tree</Trans>} sx={{ justifyContent: 'start', flex: '1 1 auto' }} fieldStyles={{ marginLeft: 'auto', width: '40%' }} />
        <Button variant="contained" color="secondary" ><Trans>confirm</Trans></Button>
      </Box>
      <Box sx={nextOfKinContainerStyle}>
        <Typography variant="subtitle2"><Trans>whos_next?</Trans></Typography>
        <BaseDropDown name="next_of_kin" options={relationOptions} sx={{ width: '40%', marginLeft: 'auto' }} />
        <Button variant="contained" color="secondary" onClick={addRelative}><Trans>confirm</Trans></Button>
      </Box>
      <StepForm handleSave={saveProgress} />
    </Paper>
  );
};

const treeNameContainerStyle = {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  gap: 2,
};

const nextOfKinContainerStyle = {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  gap: 2,
};

export default GenealogyForm;