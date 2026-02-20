import React, { useContext, useEffect, useMemo,  useState } from "react";
import { Box, Button, Chip, Collapse, FormControl, List, ListItemIcon, MenuItem, Paper, Typography, useTheme } from "@mui/material";
import { Field, FieldArray, useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import { v4 } from "uuid";
import { useZDispatch, useZSelector } from "app/hooks";
import {
  clearFieldsByStepName, goToNextStepAction, goToPrevStepAction, loaStepFormFieldsAction, setStepFieldsAction,
  setStepsCountAction, toggleStepFormUpdatingAction, updateGlobalValuesAction
} from "app/slices/forms/stepForm";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";
import GlobalContext from "contexts/creators/global";
import {
  StepFormState, stepFormModes, genderOptions, maritalStatusOptions, relationOptions, NodeMenuActions,
  FormField, FamilyTreeFormData, FieldsSection
} from "types";
import { useAddMembers, useChangeMemberPositions, useCreateFamilyTree } from "api";
import BoxColumn from "components/common/containers/row/BoxColumn";
import BoxRow from "components/common/containers/column";
import FieldSectionsGenerator from "components/common/forms/FieldSectionsGenerator";

// @ts-ignore
const GenealogyForm = ({ setTreeCopy, treeCopy, storeImg }) => {
  // @ts-ignore
  const { totalSteps, currentFormStep, currentFormStepDetails, stepTree, mode } = useZSelector<StepFormState>(state => state.stepForm);
  const { values, setFieldValue, setValues, submitForm } = useFormikContext<FamilyTreeFormData>();
  const { modal } = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const theme = useTheme();
  const { isPending: isCreateFamilyTreePending } = useCreateFamilyTree();
  const { isPending: isAddMembersPending } = useAddMembers();
  const { isPending: isChangePositionsPending } = useChangeMemberPositions();
  const isProcessing = isChangePositionsPending || isCreateFamilyTreePending || isAddMembersPending;
  const isEditMode = useMemo(() => mode === stepFormModes.edit, [mode]);
  const fieldNamePrefix = currentFormStepDetails.name?.length ? currentFormStepDetails.name : 'anchor';
  const sections: FieldsSection[] = [
    {
      title: <Trans>basic_identification</Trans>,
      fields: [{
        fieldName:
          `${fieldNamePrefix}_firstName`, label: <Trans>firstName</Trans>, value: values?.[`${fieldNamePrefix}_firstName`] || ''
      },
      { fieldName: `${fieldNamePrefix}_lastName`, label: <Trans>lastName</Trans>, value: values?.[`${fieldNamePrefix}_lastName`] || '' },
      { fieldName: `${fieldNamePrefix}_email`, label: <Trans>email</Trans>, type: "email", value: values?.[`${fieldNamePrefix}_email`] || '' },
      {
        fieldName: `${fieldNamePrefix}_gender`, label: <Trans>gender</Trans>, subComponent: () => (
          <BaseDropDown
            options={genderOptions} id="gender-selection" name={`${fieldNamePrefix}_gender`}
          />),
        value: values?.[`${fieldNamePrefix}_gender`] || ''
      },
      ]
    },
    {
      title: <Trans>personal_life</Trans>, fields: [
        {
          fieldName: `${fieldNamePrefix}_marital_status`, label: <Trans>marital_status</Trans>, subComponent: () => (
            <BaseDropDown
              name={`${fieldNamePrefix}_marital_status`}
              options={maritalStatusOptions}
              id={`${fieldNamePrefix}_marital_status-selection`}
              sx={{ height: '1rem' }}
            />
          ),
          value: values?.[`${fieldNamePrefix}_marital_status`] || ''
        },
        { fieldName: `${fieldNamePrefix}_dob`, label: <Trans>dob</Trans>, type: "date", value: values?.[`${fieldNamePrefix}_dob`] || '' },
        { fieldName: `${fieldNamePrefix}_dod`, label: <Trans>dod</Trans>, type: "date", value: values?.[`${fieldNamePrefix}_dod`] || '' },
      ]
    },
    {
      title: <Trans>others</Trans>, fields: [
        { fieldName: `${fieldNamePrefix}_occupation`, label: <Trans>occupation</Trans>, value: values?.[`${fieldNamePrefix}_occupation`] || '' },
        { fieldName: `${fieldNamePrefix}_description`, label: <Trans>description</Trans>, value: values?.[`${fieldNamePrefix}_description`] || '' },
        { fieldName: `${fieldNamePrefix}_profile_url`, label: <Trans>picture</Trans>, type: 'image' },
      ]
    },
  ];

  useEffect(() => {
    dispatch(toggleStepFormUpdatingAction(isProcessing));
  }, [isProcessing]);
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

  function generateFieldsForRelative(stepNumber: number, reset: boolean) {
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
        { fieldName: `${nameOfStep}_profile_url`, label: <Trans>picture</Trans>, type: 'image' },
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
    <Paper sx={{ flexDirection: "column", border: 'none' }} elevation={0}>
      <Typography variant="h5">about</Typography>
      <Typography variant="body2"><Trans>family_tree_building_explanation</Trans></Typography>
      <BoxColumn>
        <Typography variant="h5">form_composition</Typography>
        <Typography variant="subtitle2"><Trans>name_your_tree</Trans></Typography>
        <FormControl>
          <Field name="treeName" />
        </FormControl>
        <Typography variant="subtitle2"><Trans>whos_next?</Trans></Typography>
        <BoxRow >
          <FormControl>
            <BaseDropDown name="next_of_kin" options={relationOptions} />
          </FormControl>
          <Button variant="outlined" color="primary" onClick={addRelative}><Trans>confirm</Trans></Button>
        </BoxRow>
      </BoxColumn>
      <FieldSectionsGenerator sections={sections}/>
    </Paper>
  );
};

export default GenealogyForm;