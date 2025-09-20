import React from "react";
import { Box, Typography } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { FieldAndLabelProps } from "types";


const FieldAndLabel = ({ direction = 'row', fieldName, label, fieldStyles, fieldType = 'text', labelStyles, sx, children, required = false }: FieldAndLabelProps) => {
  const { values } = useFormikContext<any>();

  return (
    <Box sx={{ ...sx || {}, display: 'flex', flexDirection: direction, gap: 2 }}>
      <Typography variant="subtitle2">{label}</Typography>
      {/* {fieldType === 'array' ? (
        <></>
        // <FieldArray name={fieldName} render={fields => children} />
      ) : fieldType === 'select' ? (
        <FormControl aria-label={label} sx={fieldStyles}>
          {children}
        </FormControl>
      ) : (
        <Field id={`${label}-field`} name={fieldName} value={values[fieldName]} required={!!required} styles={fieldStyles}/>
      )} */}
      <Field id={`${label}-field`} name={fieldName} value={values[fieldName]} required={!!required} style={fieldStyles} />
    </Box>
  );
};

export default FieldAndLabel;