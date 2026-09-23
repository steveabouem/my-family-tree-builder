import React, { useState } from 'react';
import { Field, useFormikContext } from 'formik';
import { Checkbox, Collapse, FormControl, FormControlLabel, List, ListItemIcon, MenuItem, Radio, RadioGroup, Typography, useTheme } from '@mui/material';
import BoxColumn from '../containers/row/BoxColumn';
import BoxRow from '../containers/column';
import { CollapseIcon, ExpandIcon } from 'utils/assets/icons';
import ImageField from './imageField';
import { FieldsSection, InputType } from 'types';
import CustomField from './customField';
import { traverse } from 'utils/parsingAndFormatting';

const FieldSectionsGenerator = ({sections}: {sections: FieldsSection[]}) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({ 0: true, 1: true, 2: true, 3: true });
  const theme = useTheme();
  const { values, setFieldValue } = useFormikContext<any>();

  function toggleSection(sectionIndex: number) {
    setExpanded((prev: any) => ({ ...prev, [sectionIndex]: !prev?.[sectionIndex] }));
  }
  function handleFieldValueChange(e: React.ChangeEvent<HTMLInputElement>, name: string) {
    setFieldValue(name, e.target.value);
  }

  return (
    <BoxColumn>
      <BoxColumn sx={{ justifyContent: 'space-evenly', gap: '1rem', paddingY: '1rem' }}>
        {sections?.map((s, sectionIndex) => (
          <List sx={{ borderRadius: '5px' }} >
            <BoxRow sx={{ justifyContent: 'space-between', padding: '.5rem' }}>
              <BoxRow>
                <Typography variant="h5">{s.title}</Typography>
                <Typography color={theme.palette.error.light}>{s?.required ? '*' : ''}</Typography>
              </BoxRow>
              <ListItemIcon sx={{ justifyContent: 'end' }}>
                {expanded?.[sectionIndex] ?
                  <ExpandIcon link onClick={() => toggleSection(sectionIndex)} color={theme.palette.primary.contrastText} />
                  :
                  <CollapseIcon link onClick={() => toggleSection(sectionIndex)} color={theme.palette.primary.contrastText} />
                }
              </ListItemIcon>
            </BoxRow>
            <Collapse in={!!expanded?.[sectionIndex]} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: theme.palette.secondary.main }}>
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
        ))}
      </BoxColumn>
    </BoxColumn>
  );
};

export default FieldSectionsGenerator;