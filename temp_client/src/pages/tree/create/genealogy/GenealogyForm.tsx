import React, { useContext, useEffect, useMemo } from "react";
import { Box, Button, Chip, FormControl, MenuItem, Paper, Typography, useTheme } from "@mui/material";
import { Field, FieldArray, useFormikContext } from "formik";
import { Trans } from "@lingui/macro";
import { v4 } from "uuid";
import StepForm from "components/common/forms/stepform";
import { useZDispatch, useZSelector } from "app/hooks";
import { clearFieldsByStepName, goToNextStepAction, goToPrevStepAction, loaStepFormFieldsAction, setStepFieldsAction, setStepsCountAction, toggleStepFormUpdatingAction, updateGlobalValuesAction } from "app/slices/forms/stepForm";
import FieldAndLabel from "components/common/forms/fieldAndlabel";
import BaseDropDown from "components/common/dropdowns/BaseDropdown";
import GlobalContext from "contexts/creators/global";
import { StepFormState, stepFormModes, genderOptions, maritalStatusOptions, relationOptions, NodeMenuActions, FormField, FamilyTreeFormData, FieldsSection } from "types";
import { useAddMembers, useChangeMemberPositions, useCreateFamilyTree } from "api";
import BoxColumn from "components/common/containers/row/BoxColumn";
import BoxRow from "components/common/containers/column";
import CustomField from "components/common/forms/customField";
import ImageField from "components/common/forms/imageField";

// @ts-ignore
const GenealogyForm = ({ setTreeCopy, treeCopy, storeImg }) => {
  // @ts-ignore
  const { totalSteps, currentFormStep, currentFormStepDetails, stepTree, mode } = useZSelector<StepFormState>(state => state.stepForm);
  const { values, setFieldValue, setValues } = useFormikContext<FamilyTreeFormData>();
  const { modal } = useContext(GlobalContext);
  const dispatch = useZDispatch();
  const theme = useTheme();
  const { isPending: isCreateFamilyTreePending } = useCreateFamilyTree();
  const { isPending: isAddMembersPending } = useAddMembers();
  const { isPending: isChangePositionsPending } = useChangeMemberPositions();
  const isProcessing = isChangePositionsPending || isCreateFamilyTreePending || isAddMembersPending;
  const isEditMode = useMemo(() => mode === stepFormModes.edit, [mode]);
  const sectionStyles = { border: `1px solid ${theme.palette.primary.contrastText}`, borderRadius: '5px', padding: '1rem', width: '100%' };
  const formBody = useMemo(() => {
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

    const Body = () => {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: '1rem', position: 'relative' }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">
              <Trans>current_form_step</Trans>
            </Typography>
            {/* // stepTree starts at 0 in the store */}
            <Chip label={currentFormStep + 1} variant="filled" color="primary" size="small" sx={{ padding: '.5rem', borderRadius: '0.4rem' }} />
          </Box>
          <Box display="flex" justifyContent="flex-start" gap={2} alignItems="center">
            <Box display="flex" flexDirection="column" gap={2} justifyContent="center" width="100%">
              <Typography variant="body1">{currentFormStepDetails?.title}</Typography>
              <Typography variant="body1">{currentFormStepDetails?.subtitle}</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
              <Button variant="contained" disabled={currentFormStep === 0} color="primary" onClick={() => dispatch(goToPrevStepAction())}>
                <Trans>prev</Trans>
              </Button>
              <Button variant="contained" color="primary" onClick={() => dispatch(goToNextStepAction())} disabled={currentFormStep === totalSteps - 1}>
                <Trans>next</Trans>
              </Button>
            </Box>
          </Box>
          <BoxColumn sx={{ justifyContent: 'space-evenly', width: '100%' }}>
            {sections.map((s, i) => (
              <BoxColumn sx={sectionStyles}>
                <Typography variant="h5">{s.title}</Typography>
                <BoxColumn sx={{ width: '100%' }}>
                  {s.fields.map((f) => (
                    <>
                    <Typography variant="subtitle2">{f.label}</Typography>
                      {f.subComponent ? (
                        <CustomField id={f?.id || ''} name={f.fieldName} value={f.subComponent.displayValue}
                          required={!!f.required} component={f.subComponent} key={`${f.fieldName}-custom`}  />
                      ) : f.type === 'array' ? (
                        <FieldArray name={f.fieldName} render={fields => f.subComponent} key={`${f.fieldName}-array`} /> // TODO: this is incorrect
                      ) : f.type === 'select' ? (
                        <FormControl aria-label="Default select example" key={`${f.fieldName}-select`} >
                          {f?.options?.map((o, i) => <MenuItem value={o?.value} key={`select-option-${o?.label || ''}-${i}`} >{o?.label || '_'}</MenuItem>)}
                        </FormControl>
                      ) : f.type === 'image' ? (
                        <FormControl >
                          <ImageField id={f?.id || ''} name={f.fieldName} required={!!f.required}
                            key={`${f.fieldName}-image`} />
                        </FormControl>
                      ) : (
                        <FormControl >

                          <Field
                            id={f?.id || ''} name={f.fieldName} value={values[f.fieldName]} 
                            required={!!f.required} type={f?.type || 'text'} key={`${f.fieldName}-input`}
                          />
                        </FormControl>
                      )}
                      {/* <FieldAndLabel direction="column" fieldName={f.fieldName} label={f.label} sx={{ width: '100%' }} /> */}
                    </>
                  ))}
                </BoxColumn>
              </BoxColumn>
            ))}
          </BoxColumn>
          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
            <Button variant="contained" disabled={currentFormStep === 0} color="primary" onClick={() => dispatch(goToPrevStepAction())}>
              <Trans>prev</Trans>
            </Button>
            <Button variant="contained" color="primary" onClick={() => dispatch(goToNextStepAction())} disabled={currentFormStep === totalSteps - 1}>
              <Trans>next</Trans>
            </Button>
          </Box>
        </Box>
      )
    };

    return <Body />;
  }, [currentFormStep, totalSteps, currentFormStepDetails?.name]);

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
      <BoxColumn sx={sectionStyles}>
        <Typography variant="h5">form_management</Typography>
        <BoxRow sx={{ width: '100%' }}>
          <FieldAndLabel
            direction="row" fieldName="treeName" label={<Trans>name_your_tree</Trans>}
            sx={{ justifyContent: 'space-between', flex: '1', width: '100%' }}
            fieldStyles={{ marginLeft: 'auto', width: '40%' }}
          />
        </BoxRow>
        <BoxRow sx={{ width: '100%' }}>
          <Typography variant="subtitle2"><Trans>whos_next?</Trans></Typography>
          <BoxRow sx={{ flex: 1 }}>
            <BaseDropDown name="next_of_kin" options={relationOptions} sx={{ width: '40%', marginLeft: 'auto' }} />
            <Button variant="outlined" color="primary" onClick={addRelative}><Trans>confirm</Trans></Button>
          </BoxRow>
        </BoxRow>
      </BoxColumn>
      {/* <StepForm handleSave={() => { }} duplicateBottomActions /> */}
      {formBody}
    </Paper>
  );
};

export default GenealogyForm;