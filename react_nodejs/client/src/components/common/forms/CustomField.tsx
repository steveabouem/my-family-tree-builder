import { Trans } from "@lingui/macro";
import { Box, TextField } from "@mui/material";
import { Field, FieldProps, useFormikContext } from "formik";
import React from "react";
import { CustomFieldProps } from "./forms.types";

const CustomField = (props: CustomFieldProps ) => {
  const { errors } = useFormikContext();


  return (
    <Box display="flex" flexDirection="column">
      <Field>
        {(formikProps: FieldProps) => (
          <TextField onChange={formikProps.field.onChange} {...props} />
        )}
      </Field>
      {errors ? <Trans>generic_field_error</Trans> : ''}
    </Box>
  );
};

export default CustomField;