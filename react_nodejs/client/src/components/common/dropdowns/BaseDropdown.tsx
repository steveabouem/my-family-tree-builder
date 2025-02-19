import React from "react";
import { DBaseDropDownProps, DDropdownOption } from "./definitions";
import { FormControl, Select, MenuItem } from "@mui/material";
import { Trans } from "@lingui/macro";
import { useFormikContext } from "formik";
import('./styles.scss');

const BaseDropDown = <V,>({ id, label, name, options, additionalClass, onChangeCB, sx, displayVal }: DBaseDropDownProps<V>): JSX.Element => {
  const { setFieldValue, setFieldTouched, values } = useFormikContext<V>();

  function handleFieldValueChange(v: string | number) {
    setFieldTouched(name, true);
    setFieldValue(name, v);

    if (onChangeCB)
      onChangeCB(v);
  }

  return (
    <FormControl sx={{ width: '100%', height: '35px', ...sx }}>
      <Select
        // @ts-ignore
        value={values[name]} required
        placeholder={`${<Trans>select</Trans>}`}
        labelId=""
        id={id || ''}
        label={label}
        size="small"
        onChange={(e) => handleFieldValueChange(e.target.value)}
        className={additionalClass}
      >
        {options.map((option: DDropdownOption, i: number) => <MenuItem value={option.value} key={`${id || ''}-dropdown-option-${i}`}>{option.label}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

export default BaseDropDown;