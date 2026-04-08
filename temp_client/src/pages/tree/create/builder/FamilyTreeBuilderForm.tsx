import React, { useContext, useEffect} from "react";
import { Button, FormControl, FormControlLabel, Paper, Radio, Typography } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import { v4 } from "uuid";
import { useZDispatch, useZSelector } from "app/hooks";
import {
  clearFieldsByStepName, loadStepFormSectionsAction, setStepsCountAction,
  setStepSectionsAction, toggleStepFormUpdatingAction, updateGlobalValuesAction
} from "app/slices/forms/stepForm";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";
import GlobalContext from "contexts/creators/global";
import {
  StepFormState, genderOptions, maritalStatusOptions, relationOptions,
  NodeMenuActions, FieldsSection, InputType, MemberVisibility, TreeVisibility,
  DropdownOption
} from "types";
import { useAddMembers, useChangeMemberPositions, useCreateFamilyTree } from "api";
import BoxColumn from "components/common/containers/row/BoxColumn";
import BoxRow from "components/common/containers/column";
import FieldSectionsGenerator from "components/common/forms/FieldSectionsGenerator";

export const FamilyTreeBuilderForm = ({  storeImg }: any) => {
  const { totalSteps, currentFormStep, stepTree} = useZSelector<StepFormState>(state => state.stepForm);
  const { values, setFieldValue, setValues } = useFormikContext<any>();
  const { modal } = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const { isPending: isCreateFamilyTreePending } = useCreateFamilyTree();
  const { isPending: isAddMembersPending } = useAddMembers();
  const { isPending: isChangePositionsPending } = useChangeMemberPositions();
  const isProcessing = isChangePositionsPending || isCreateFamilyTreePending || isAddMembersPending;
  const membersDropdownOptions: (DropdownOption & { key?: string })[] = Object.keys(values?.members || {}).map((key: string) => (
    {
      label: `${values?.members?.[key]?.first_name || ''} ${values?.members?.[key]?.last_name || ''}`,
      value: values?.members?.[key]?.node_id,
      id: values?.members?.[key]?.node_id,
      key
    }
  )) || [{
    label: '',
    value: '',
    id: '',
  }];

  useEffect(() => {
    dispatch(toggleStepFormUpdatingAction(isProcessing));
  }, [isProcessing]);
  useEffect(() => {
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
      const newNodeId = values?.members?.[nameOfStep]?.node_id || v4();
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
    * user will select the relative type (kinship) for the next step, or any of the  steps before the current one.
    */
    const currentStepKey = Object.keys(stepTree || {}).find((key: string) => stepTree?.[key]?.step === currentFormStep) || 'anchor';
    const selectedMember = membersDropdownOptions.find((m: any) => m.value === values?.next_of_kin_member)
      || membersDropdownOptions.find((m: any) => m.key === currentStepKey);
    const selectedRelation = values?.next_of_kin;
    const newRelativeNodeId = v4();
    const nextStepName = `${selectedRelation}-${totalSteps + 1}`;

    const relationArrayMap: Record<string, { selectedMemberArray: 'siblings' | 'parents' | 'children' | 'spouses'; newMemberArray: 'siblings' | 'parents' | 'children' | 'spouses' }> = {
      sister: { selectedMemberArray: 'siblings', newMemberArray: 'siblings' },
      brother: { selectedMemberArray: 'siblings', newMemberArray: 'siblings' },
      husband: { selectedMemberArray: 'spouses', newMemberArray: 'spouses' },
      wife: { selectedMemberArray: 'spouses', newMemberArray: 'spouses' },
      mother: { selectedMemberArray: 'parents', newMemberArray: 'children' },
      father: { selectedMemberArray: 'parents', newMemberArray: 'children' },
      son: { selectedMemberArray: 'children', newMemberArray: 'parents' },
      daughter: { selectedMemberArray: 'children', newMemberArray: 'parents' },
    };
    const relationArrays = relationArrayMap[selectedRelation];

    const pushUnique = (arr: string[] = [], value?: string) => {
      if (!value) return arr || [];
      return arr.includes(value) ? arr : [...arr, value];
    };

    //1: Adds an additional step at the end of the list
    dispatch(setStepsCountAction(totalSteps + 1));
    //2: assign right prefixto that step, without creating the fields
    dispatch(setStepSectionsAction({ name: nextStepName, fields: [], step: totalSteps + 1 }));

    // Pre-seed the upcoming member with required values so the generated node_id can be linked immediately.
    setFieldValue(`members.${nextStepName}.node_id`, newRelativeNodeId);
    setFieldValue(`members.${nextStepName}.step_number`, totalSteps + 1);
    setFieldValue(`members.${nextStepName}.parents`, values?.members?.[nextStepName]?.parents || []);
    setFieldValue(`members.${nextStepName}.siblings`, values?.members?.[nextStepName]?.siblings || []);
    setFieldValue(`members.${nextStepName}.spouses`, values?.members?.[nextStepName]?.spouses || []);
    setFieldValue(`members.${nextStepName}.children`, values?.members?.[nextStepName]?.children || []);

    const selectedMemberKey = (selectedMember as any)?.key;
    const selectedMemberNodeId = selectedMember?.value as string | undefined;

    // Link selected existing member <-> newly created member from selected member's perspective.
    if (relationArrays && selectedMemberKey && selectedMemberNodeId) {
      const selectedMemberCurrent = values?.members?.[selectedMemberKey]?.[relationArrays.selectedMemberArray] || [];
      const newMemberCurrent = values?.members?.[nextStepName]?.[relationArrays.newMemberArray] || [];
      setFieldValue(`members.${selectedMemberKey}.${relationArrays.selectedMemberArray}`, pushUnique(selectedMemberCurrent, newRelativeNodeId));
      setFieldValue(`members.${nextStepName}.${relationArrays.newMemberArray}`, pushUnique(newMemberCurrent, selectedMemberNodeId));
    }
  }

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
        <BoxColumn>
          <Typography variant="subtitle2"><Trans>source_member</Trans></Typography>
          <BaseDropDown name="next_of_kin_member" options={membersDropdownOptions} />
          <Typography variant="subtitle2"><Trans>relates_to</Trans></Typography>
          <BaseDropDown name="next_of_kin" options={relationOptions} />
          <Button variant="outlined" color="primary" onClick={addRelative}><Trans>confirm</Trans></Button>
        </BoxColumn>
      </BoxColumn>
      <FieldSectionsGenerator />
    </Paper>
  );
};