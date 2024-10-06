import React from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { DBaseFormProps, DFormField } from "../definitions";
import { PiAsteriskSimpleFill } from 'react-icons/pi';
import { Box, Typography, Paper, Button, FormControl, MenuItem } from "@mui/material";
import CustomField from "./CustomField";
import('./styles.scss');

const FormFieldsGenerator = ({
  fields, handleSubmit,
  size, handleFieldValueChange, title
}: DBaseFormProps): JSX.Element => {
  const {isSubmitting} = useFormikContext();
  
  return (
    <Paper>
      {title ? <Typography variant="h4">{title}</Typography> : null}
      {fields.map((field: DFormField, i: number) => (
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="subtitle2">
            {field.label}{field.required ? <PiAsteriskSimpleFill className="bg-accent" /> : null}
          </Typography>
          {field.subComponent ? (
            <CustomField  id={field?.id || ''} name={field.fieldName} value={field.subComponent.displayValue}
              required={!!field.required} component={field.subComponent} />
          ) : field.type === 'array' ? (
            <FieldArray name={field.fieldName} render={fields => field.subComponent} /> // TODO: this is incorrect
          ) : field.type === 'select' ? (
            <FormControl aria-label="Default select example">
              {/* <InputLabel></InputLabel> */}
              {field?.options?.map((o, i) => <MenuItem value={o?.value} key={`select-option-${o?.label || ''}-${i}`}>{o?.label || '_'}</MenuItem>)}
              
            </FormControl>
          ) : (
            <Field
              id={field?.id || ''} name={field.fieldName} value={field.value}
              required={!!field.required} type={field?.type || 'input'}
            />
          )}
        </Box>
      ))}
      <Box >
        <Button variant="contained" color="success" onClick={handleSubmit} />
      </Box>
    </Paper>
  );
}

export default FormFieldsGenerator;