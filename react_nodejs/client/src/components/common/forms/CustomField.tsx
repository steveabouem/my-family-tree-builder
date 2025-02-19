import { Trans } from "@lingui/macro";
import { Box, FormControl, TextField } from "@mui/material";
import { Field, FieldProps, FormikContextType, useFormikContext } from "formik";
import React from "react";
import { CustomFieldProps } from "./forms.types";

const CustomField = (props: CustomFieldProps) => {
  const helpers: FormikContextType<any> = useFormikContext();

  function handleFieldChange(v: any) {
    if (helpers?.values && props?.name) {
      helpers.setFieldValue(props.name, v);
    } else {
      props?.onChange(v);
    }
  }

  return (
    <FormControl sx={{display:"flex", flexDirection:"column", height:"35px"}}>
      <TextField onChange={handleFieldChange} {...props} size="small"/>
      {props?.name && helpers?.errors?.[props.name] ? <Trans>generic_field_error</Trans> : ''}
    </FormControl>
  );
};

export default CustomField;