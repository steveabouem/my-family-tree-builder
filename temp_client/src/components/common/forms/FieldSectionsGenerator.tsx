import React, { useState } from 'react'
import {
  Box, Button, Checkbox, Chip, Collapse, FormControl, FormControlLabel, List, ListItemIcon,
  MenuItem, Radio, RadioGroup, Typography, useTheme
} from '@mui/material';
import { Trans } from '@lingui/macro';
import BoxColumn from '../containers/row/BoxColumn';
import BoxRow from '../containers/column';
import { CollapseIcon, ExpandIcon } from 'utils/assets/icons';
import CustomField from './customField';
import { Field, FieldArray, useFormikContext } from 'formik';
import ImageField from './imageField';
import { InputType, StepFormState } from 'types';
import { useZDispatch, useZSelector } from 'app/hooks';
import { goToNextStepAction, goToPrevStepAction } from 'app/slices/forms/stepForm';
import { traverse } from 'utils/parsingAndFormatting';

export const FieldSectionsGenerator = () => {
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({ 0: true });
  const { totalSteps, currentFormStep, currentFormStepDetails } = useZSelector<StepFormState>(state => state.stepForm);
  const dispatch = useZDispatch();
  const theme = useTheme();
  const { values, submitForm, setFieldValue } = useFormikContext<any>();

  function toggleSection(sectionIndex: number) {
    setCollapsed((prev: any) => ({ ...prev, [sectionIndex]: !prev?.[sectionIndex] }));
  }
  function handleFieldValueChange(e: React.ChangeEvent<HTMLInputElement>, name: string) {
    setFieldValue(name, e.target.value);
  }

  return (
    <BoxColumn>
      <BoxColumn>
        <BoxRow sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body1">
            <Trans>current_form_step</Trans>
          </Typography>
          <Chip label={currentFormStep} variant="filled" color="primary" size="small" sx={{ padding: '.5rem', borderRadius: '0.4rem' }} />
        </BoxRow>
        <Typography variant="body1">{currentFormStepDetails?.title}</Typography>
        <Typography variant="body1">{currentFormStepDetails?.subtitle}</Typography>
        <BoxRow sx={{ justifyContent: "flex-end" }} >
          <Button variant="contained" disabled={currentFormStep === 1} color="primary" onClick={() => dispatch(goToPrevStepAction())}>
            <Trans>prev</Trans>
          </Button>
          <Button variant="contained" color="primary" onClick={() => dispatch(goToNextStepAction())} disabled={currentFormStep === totalSteps}>
            <Trans>next</Trans>
          </Button>
        </BoxRow>
      </BoxColumn>
      <BoxColumn sx={{ justifyContent: 'space-evenly', gap: '1rem', paddingY: '1rem' }}>
        {currentFormStepDetails?.sections?.map((s, sectionIndex) => {
          return (
            <List sx={{ borderRadius: '5px' }} >
              <BoxRow sx={{ justifyContent: 'space-between', padding: '.5rem' }}>
                <BoxRow>
                  <Typography variant="h5">{s.title}</Typography>
                  <Typography color={theme.palette.error.light}>{s?.required ? '*' : ''}</Typography>
                </BoxRow>
                <ListItemIcon sx={{ justifyContent: 'end' }}>
                  {collapsed?.[sectionIndex] ?
                    <ExpandIcon link onClick={() => toggleSection(sectionIndex)} color={theme.palette.primary.contrastText} />
                    :
                    <CollapseIcon link onClick={() => toggleSection(sectionIndex)} color={theme.palette.primary.contrastText} /> 
                  }
                </ListItemIcon>
              </BoxRow>
              <Collapse in={!!collapsed?.[sectionIndex]} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: theme.palette.secondary.main }}>
                <BoxColumn sx={{ gap: '1rem' }}>
                  {s.fields.map((field) => {
                    const fieldVal = traverse(values, field.fieldName)
                    
                    return (
                      <BoxColumn sx={{ gap: '.5rem' }} >
                        <Typography variant="subtitle2">{field.label}</Typography>
                        <BoxColumn sx={{ width: '100%' }}>
                          <BoxRow sx={{ justifyContent: 'end' }}>
                            {field.subComponent ? (
                              <CustomField id={field?.id || ''} name={field.fieldName} value={field.subComponent.displayValue}
                                required={!!field.required} component={field.subComponent} />
                            ) : field?.type === InputType.array ? (
                              <FieldArray name={field.fieldName} render={fields => field.subComponent} /> // TODO: this is incorrect
                            ) : field?.type === InputType.select ? (
                              <FormControl aria-label={`select-for-${field.fieldName}`} >
                                {field?.options?.map((o, i) => <MenuItem value={o?.value} selected={fieldVal === o.value}>{o?.label || '_'}</MenuItem>)}
                              </FormControl>
                            ) : field?.type === InputType.radio ? (
                              <FormControl >
                                <RadioGroup value={fieldVal} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldValueChange(e, field.fieldName)}>
                                  <BoxRow sx={{ justifyContent: 'flex-end' }} >
                                    {field?.options?.map((o, i) => (
                                      <FormControlLabel aria-valuenow={i + 1} value={o.value} label={o?.label || ''}
                                        control={<Radio />} />
                                    ))}
                                  </BoxRow>
                                </RadioGroup>
                              </FormControl>
                            ) : field?.type === InputType.checkbox ? (
                              <FormControlLabel control={<Checkbox checked={fieldVal as boolean}
                                onClick={() => { setFieldValue(field.fieldName, !fieldVal) }} />}
                                label={field.label || ''}
                              />
                            ) : field?.type === InputType.image ? (
                              <FormControl>
                                <ImageField id={field?.id || ''} name={field.fieldName} required={!!field.required}
                                />
                              </FormControl>
                            ) : (
                              <FormControl>
                                <Field
                                  id={field?.id || ''} name={field.fieldName} value={fieldVal}
                                  required={!!field.required} type={field?.type || 'text'}
                                />
                              </FormControl>
                            )}
                          </BoxRow>
                        </BoxColumn>
                      </BoxColumn>
                    )
                  })}
                </BoxColumn>
              </Collapse>
            </List>
          )
        }
        )}
      </BoxColumn>
      <BoxRow sx={{ justifyContent: "flex-end", alignItems: "center" }}>
        <Button variant="contained" disabled={currentFormStep === 1} color="primary" onClick={() => dispatch(goToPrevStepAction())}>
          <Trans>prev</Trans>
        </Button>
        <Button variant="contained" color="primary" onClick={() => dispatch(goToNextStepAction())} disabled={currentFormStep === totalSteps}>
          <Trans>next</Trans>
        </Button>
      </BoxRow>
      <BoxRow>
        <Box display="flex" justifyContent="end" width="100%">
          <Button variant="contained" color="success" onClick={submitForm}><Trans>submit</Trans></Button>
        </Box>
      </BoxRow>
    </BoxColumn>
  );
};

export default FieldSectionsGenerator;