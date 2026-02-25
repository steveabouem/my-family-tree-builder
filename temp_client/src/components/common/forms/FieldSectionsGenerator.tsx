import React, { memo, useState } from 'react'
import { Box, Button, Chip, Collapse, FormControl, List, ListItemIcon, MenuItem, Typography, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import BoxColumn from '../containers/row/BoxColumn';
import BoxRow from '../containers/column';
import { CollapseIcon, ExpandIcon } from 'utils/assets/icons';
import CustomField from './customField';
import { Field, FieldArray, useFormikContext } from 'formik';
import ImageField from './imageField';
import { FieldsSection, StepFormState } from 'types';
import { useZDispatch, useZSelector } from 'app/hooks';
import { goToNextStepAction, goToPrevStepAction } from 'app/slices/forms/stepForm';

export const FieldSectionsGenerator = memo(({ sections }: { sections: FieldsSection[] }) => {
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({ 0: false });
  const { totalSteps, currentFormStep, currentFormStepDetails, stepTree, mode } = useZSelector<StepFormState>(state => state.stepForm);
  const dispatch = useZDispatch();
  const theme = useTheme();
  const { values, submitForm } = useFormikContext<any>();

  function toggleSection(sectionIndex: number) {
    setCollapsed((prev: any) => ({ ...prev, [sectionIndex]: !prev?.[sectionIndex] }));
  }

  return (
    <BoxColumn>
      <BoxColumn>
        <BoxRow sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body1">
            <Trans>current_form_step</Trans>
          </Typography>
          <Chip label={currentFormStep + 1} variant="filled" color="primary" size="small" sx={{ padding: '.5rem', borderRadius: '0.4rem' }} />
        </BoxRow>
        <Typography variant="body1">{currentFormStepDetails?.title}</Typography>
        <Typography variant="body1">{currentFormStepDetails?.subtitle}</Typography>
        <BoxRow sx={{ justifyContent: "flex-end" }} >
          <Button variant="contained" disabled={currentFormStep === 0} color="primary" onClick={() => dispatch(goToPrevStepAction())}>
            <Trans>prev</Trans>
          </Button>
          <Button variant="contained" color="primary" onClick={() => dispatch(goToNextStepAction())} disabled={currentFormStep === totalSteps - 1}>
            <Trans>next</Trans>
          </Button>
        </BoxRow>
      </BoxColumn>
      <BoxColumn sx={{ justifyContent: 'space-evenly' }}>
        {sections.map((s, sectionIndex) => (
          <List sx={{ background: `${theme.palette.primary.contrastText}`, borderRadius: '5px' }}>
            <BoxRow sx={{ justifyContent: 'space-between', padding: '.5rem' }}>
              <Typography variant="h5">{s.title}</Typography>
              <ListItemIcon sx={{ justifyContent: 'end' }}>
                {collapsed?.[sectionIndex] ?
                  <CollapseIcon link onClick={() => toggleSection(sectionIndex)} color={theme.palette.background.default} /> :
                  <ExpandIcon link onClick={() => toggleSection(sectionIndex)} color={theme.palette.background.default} />
                }
              </ListItemIcon>
            </BoxRow>
            <Collapse in={!!collapsed?.[sectionIndex]} >
              {s.fields.map((f) => (
                <BoxColumn>
                  <BoxColumn>
                    <Typography variant="subtitle2">{f.label}</Typography>
                    {f.subComponent ? (
                      <CustomField id={f?.id || ''} name={f.fieldName} value={f.subComponent.displayValue}
                        required={!!f.required} component={f.subComponent} key={`${f.fieldName}-custom`} />
                    ) : f.type === 'array' ? (
                      <FieldArray name={f.fieldName} render={fields => f.subComponent} key={`${f.fieldName}-array`} /> // TODO: this is incorrect
                    ) : f.type === 'select' ? (
                      <FormControl aria-label="Default select example" key={`${f.fieldName}-select`} >
                        {f?.options?.map((o, i) => <MenuItem value={o?.value} key={`select-option-${o?.label || ''}-${i}`} >{o?.label || '_'}</MenuItem>)}
                      </FormControl>
                    ) : f.type === 'image' ? (
                      <ImageField id={f?.id || ''} name={f.fieldName} required={!!f.required}
                        key={`${f.fieldName}-image`} />
                    ) : (
                      <FormControl >
                        <Field
                          id={f?.id || ''} name={f.fieldName} value={values[f.fieldName]}
                          required={!!f.required} type={f?.type || 'text'} key={`${f.fieldName}-input`}
                        />
                      </FormControl>
                    )}
                  </BoxColumn>
                </BoxColumn>
              ))}
            </Collapse>
          </List>
        ))}
      </BoxColumn>
      <BoxRow sx={{ justifyContent: "flex-end", alignItems: "center" }}>
        <Button variant="contained" disabled={currentFormStep === 0} color="primary" onClick={() => dispatch(goToPrevStepAction())}>
          <Trans>prev</Trans>
        </Button>
        <Button variant="contained" color="primary" onClick={() => dispatch(goToNextStepAction())} disabled={currentFormStep === totalSteps - 1}>
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
});

export default FieldSectionsGenerator;