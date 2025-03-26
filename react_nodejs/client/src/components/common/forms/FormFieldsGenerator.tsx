import React from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { PiAsteriskSimpleFill } from 'react-icons/pi';
import { Box, Typography, Paper, Button, FormControl, MenuItem } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { DBaseFormProps, DFormField } from "../definitions";
import CustomField from "./customField/CustomField";
import('./styles.scss');

const FormFieldsGenerator = ({
  fields, handleSubmit, withPaper = true, name = 'form',
  size, handleFieldValueChange, title, mode = 'write', locked,
}: DBaseFormProps): JSX.Element => {
  const { submitForm, values } = useFormikContext<any>();

  return (
    <Paper elevation={withPaper ? 1 : 0} sx={{ width: '100%', padding: '1rem', display: "flex", flexDirection: "column", gap: "1rem" }}>
      {title ? <Typography variant="h4">{title}</Typography> : null}
      {fields.map((field: DFormField, i: number) => (
        <Box display="flex" flexDirection="column" gap={2} key={`${name}-fields-wrapper-${i}`}>
          <Typography variant="subtitle2" pt="1rem" pb="0">
            {field.label}{field.required ? <PiAsteriskSimpleFill className="bg-accent" /> : null}
          </Typography>
          {mode === 'write' ? (
            <>
              {field.subComponent ? (
                <CustomField id={field?.id || ''} name={field.fieldName} value={field.subComponent.displayValue}
                  required={!!field.required} component={field.subComponent} />
              ) : field.type === 'array' ? (
                <FieldArray name={field.fieldName} render={fields => field.subComponent} /> // TODO: this is incorrect
              ) : field.type === 'select' ? (
                <FormControl aria-label="Default select example">
                  {field?.options?.map((o, i) => <MenuItem value={o?.value} key={`select-option-${o?.label || ''}-${i}`}>{o?.label || '_'}</MenuItem>)}
                </FormControl>
              ) : (
                <Field
                  id={field?.id || ''} name={field.fieldName} value={values[field.fieldName]}
                  required={!!field.required} type={field?.type || 'input'}
                />
              )}
            </>
          ) : (
            <Typography variant="body1">{values?.[field.fieldName] || ''}</Typography>
          )}
        </Box>
      ))}
      {!locked ? (
        <Box display="flex" justifyContent="end" width="100%">
          <Button variant="contained" color="success" onClick={submitForm}><Trans>submit</Trans></Button>
        </Box>
      ) : ''}
    </Paper>
  );
}

export default FormFieldsGenerator;