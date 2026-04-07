import React, { useContext, useEffect, useMemo } from "react";
import { Button, FormControl, FormControlLabel, Paper, Radio, Typography } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import { v4 } from "uuid";
import { useZDispatch, useZSelector } from "app/hooks";
import {
  clearFieldsByStepName, loadStepFormSectionsAction, setStepsCountAction, cleanupAction,
  setStepSectionsAction, toggleStepFormUpdatingAction, updateGlobalValuesAction
} from "app/slices/forms/stepForm";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";
import GlobalContext from "contexts/creators/global";
import {
  StepFormState, stepFormModes, genderOptions, maritalStatusOptions, relationOptions,
  NodeMenuActions, FieldsSection, InputType, MemberVisibility, TreeVisibility
} from "types";
import { useAddMembers, useChangeMemberPositions, useCreateFamilyTree } from "api";
import BoxColumn from "components/common/containers/row/BoxColumn";
import BoxRow from "components/common/containers/column";
import FieldSectionsGenerator from "components/common/forms/FieldSectionsGenerator";
/*
 * 
  * ISSUES: 
  * 1 - typing of create tree payload must have members as array, not object (Easy)
  * 2 - in order to have each member hold an array of their relations, we need to either
  *    a) update the form  so that when you add a new step, the field names map to the relevant array for the current one.
  *       Adding a father from step 3  should add the values to either current_step.parents, OR first_step.anchor.
  *       UX needs to be reviewed here to see which one is better, or if user should be given choice for both when updating the settings
  *    b) reinstate the formatting function to use the key value pairs as we did for V1
 */
export const FamilyTreeBuilderForm = ({ setTreeCopy, treeCopy, storeImg }: any) => {
  const { totalSteps, currentFormStep, stepTree, mode } = useZSelector<StepFormState>(state => state.stepForm);
  const { values, setFieldValue, setValues } = useFormikContext<any>();
  const { modal } = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const { isPending: isCreateFamilyTreePending } = useCreateFamilyTree();
  const { isPending: isAddMembersPending } = useAddMembers();
  const { isPending: isChangePositionsPending } = useChangeMemberPositions();
  const isProcessing = isChangePositionsPending || isCreateFamilyTreePending || isAddMembersPending;
  const isEditMode = useMemo(() => mode === stepFormModes.edit, [mode]);

  useEffect(() => {
    dispatch(toggleStepFormUpdatingAction(isProcessing));
  }, [isProcessing]);
  useEffect(() => {
    // TODO: a nice to have: dropdown to display step number or name above the fields. 
    /*
    * the form will direct user to build the tree one  member at the time
    * for each member, the user will be able to add partners, parents and children (potentially more)
    */
    console.log('Applying fields on step #', stepTree, currentFormStep);

    generateFieldsSectionsForRelative(currentFormStep, false);
  }, [currentFormStep]);
  useEffect(() => {
    if (modal?.transferData === NodeMenuActions.edit) {
      setValues({});
      dispatch(updateGlobalValuesAction({ values: {} }));
    }
  }, [modal?.transferData])

  function generateFieldsSectionsForRelative(stepNumber: number, reset: boolean) {
    const matchingStepInTree = Object.keys(stepTree || {})
      .find(((key: string) => {
        if (stepTree?.[key]?.step === stepNumber)
          return key;
      }));
    const nameOfStep = matchingStepInTree || "anchor";
    const fieldsInTree = stepTree?.[nameOfStep]?.sections || [];
    console.log('fields found at current step ', { matchingStepInTree, nameOfStep, fieldsInTree, stepNumber });

    if (fieldsInTree?.length) {
      dispatch(loadStepFormSectionsAction({
        step: stepNumber, name: `${nameOfStep}`, sections: fieldsInTree as FieldsSection[],
        title: <Trans>info_on_node {nameOfStep}</Trans>
      }));
      return;
    }

    if (reset) {
      dispatch(clearFieldsByStepName(nameOfStep));
    } else {
      const newNodeId = v4();
      const sections: FieldsSection[] = [
        {
          title: <Trans>basic_identification</Trans>,
          required: true,
          fields: [{
            fieldName:
              `members.${nameOfStep || ''}.first_name`, label: <Trans>firstName</Trans>, value: values?.members?.[`${nameOfStep || ''}.first_name`] || ''
          },
          { fieldName: `members.${nameOfStep || ''}.last_name`, label: <Trans>lastName</Trans>, value: values?.members?.[`${nameOfStep || ''}.last_name`] || '' },
          { fieldName: `members.${nameOfStep || ''}.email`, label: <Trans>email</Trans>, type: InputType.email, value: values?.members?.[`${nameOfStep || ''}.email`] || '' },
          {
            fieldName: `members.${nameOfStep || ''}.gender`, label: <Trans>gender</Trans>, subComponent: () => (
              <BaseDropDown
                options={genderOptions} id="gender-selection" name={`members.${nameOfStep || ''}.gender`}
              />),
            value: values?.members?.[`${nameOfStep || ''}.gender`] || ''
          }
          ]
        },
        {

          title: <Trans>personal_life</Trans>, fields: [
            {
              fieldName: `members.${nameOfStep || ''}.marital_status`, label: <Trans>marital_status</Trans>, subComponent: () => (
                <BaseDropDown
                  name={`members.${nameOfStep || ''}.marital_status`}
                  options={maritalStatusOptions}
                  id={`${nameOfStep || ''}.marital_status-selection`}
                  sx={{ height: '1rem' }}
                />
              ),
              value: values?.members?.[`${nameOfStep || ''}.marital_status`] || ''
            },
            { fieldName: `members.${nameOfStep || ''}.dob`, label: <Trans>dob</Trans>, type: InputType.date, value: values?.members?.[`${nameOfStep || ''}.dob`] || '' },
            {
              fieldName:
                `members.${nameOfStep || ''}.deceased`, label: <Trans>alive</Trans>,
              type: InputType.radio,
              options: [{ label: <Trans>yes</Trans>, value: false }, { label: <Trans>no</Trans>, value: true }]
            },
            { fieldName: `members.${nameOfStep || ''}.dod`, label: <Trans>dod</Trans>, type: InputType.date, value: values?.members?.[`${nameOfStep || ''}.dod`] || '' },
          ]
        },
        {
          title: <Trans>others</Trans>, fields: [
            { fieldName: `members.${nameOfStep || ''}.occupation`, label: <Trans>occupation</Trans>, value: values?.members?.[`${nameOfStep || ''}.occupation`] || '' },
            { fieldName: `members.${nameOfStep || ''}.description`, label: <Trans>description</Trans>, value: values?.members?.[`${nameOfStep || ''}.description`] || '' },
            { fieldName: `members.${nameOfStep || ''}.profile_url`, label: <Trans>picture</Trans>, type: InputType.image },
          ]
        },
        {
          title: <Trans>member_settings</Trans>, fields: [
            {
              fieldName:
                `members.${nameOfStep || ''}.send_invite`, label: <Trans>send_invite?</Trans>,
              type: InputType.checkbox
            },
            {
              fieldName:
                `members.${nameOfStep || ''}.visibility`, label: <Trans>visibility</Trans>,
              type: InputType.radio,
              options: [
                { label: <Trans>{MemberVisibility.private}</Trans>, value: MemberVisibility.private },
                { label: <Trans>{MemberVisibility.family_only}</Trans>, value: MemberVisibility.family_only },
                { label: <Trans>{MemberVisibility.public}</Trans>, value: MemberVisibility.public },
              ]
            },
            {
              fieldName: `members.${nameOfStep || ''}.is_anchor`, label: <Trans>set_as_anchor</Trans>, type: InputType.checkbox
            }
          ]
        },
      ];

      setFieldValue(`members.${nameOfStep}.node_id`, newNodeId);
      setFieldValue(`members.${nameOfStep}.step_number`, stepNumber);
      dispatch(loadStepFormSectionsAction({ name: `${nameOfStep}`, sections, title: <Trans>info_on_node {nameOfStep}</Trans>, step: stepNumber }));
    }
  }
  function addRelative() {
    /*
    * user will select the relative type (kinship) for the next step.
    */
    console.log('Current total steps  before adding relative', totalSteps, stepTree);

    //1: Adds an additional step at the end of the list
    dispatch(setStepsCountAction(totalSteps + 1));
    //2: assign right prefixto that step, without creating the fields
    dispatch(setStepSectionsAction({ name: `${values.next_of_kin}-${totalSteps + 1}`, fields: [], step: totalSteps + 1}));
    if (isEditMode) {
      setTreeCopy({ ...treeCopy, [`${totalSteps + 1}`]: values.next_of_kin });
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
        <Typography variant="subtitle2"><Trans>tree_settings</Trans></Typography>
        <FormControl>
          <Field name="name" />
        </FormControl>
        <FormControl>
          <Typography variant="subtitle2">tree_visibility</Typography>
          <BoxRow sx={{ justifyContent: 'flex-end' }} >
            <FormControlLabel
              aria-valuenow={1} label={<Trans>{TreeVisibility.private}</Trans>}
              control={
                <Radio checked={values.visibility === TreeVisibility.private}
                  onClick={() => { setFieldValue('visibility', TreeVisibility.private) }}
                />
              }
            />
            <FormControlLabel
              aria-valuenow={2} label={<Trans>{TreeVisibility.invite_only}</Trans>}
              control={
                <Radio checked={values.visibility === TreeVisibility.invite_only}
                  onClick={() => { setFieldValue('visibility', TreeVisibility.invite_only) }}
                />
              }
            />
            <FormControlLabel
              aria-valuenow={3} label={<Trans>{TreeVisibility.public}</Trans>}
              control={
                <Radio checked={values.visibility === TreeVisibility.public}
                  onClick={() => { setFieldValue('visibility', TreeVisibility.public) }}
                />
              }
            />
          </BoxRow>
        </FormControl>
        <Typography variant="subtitle2"><Trans>whos_next?</Trans></Typography>
        <BoxRow >
          <FormControl>
            <BaseDropDown name="next_of_kin" options={relationOptions} />
          </FormControl>
          <Button variant="outlined" color="primary" onClick={addRelative}><Trans>confirm</Trans></Button>
        </BoxRow>
      </BoxColumn>
      <FieldSectionsGenerator />
    </Paper>
  );
};