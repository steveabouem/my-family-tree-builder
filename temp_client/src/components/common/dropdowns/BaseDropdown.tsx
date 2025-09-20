import React from "react";
import { useFormikContext } from "formik";
import { FormControl, Select, MenuItem } from "@mui/material";
import { Trans } from "@lingui/macro";
import { BaseDropDownProps, DropdownOption } from "types";

const BaseDropDown = ({ id, label, name, options, additionalClass, onChangeCB, sx, displayVal }: BaseDropDownProps): JSX.Element => {
  const { setFieldValue, setFieldTouched, values } = useFormikContext();

  function handleFieldValueChange(optionname: string | number) {
    const selectedOption = options.find((option: DropdownOption) => option.value === optionname);

    if (selectedOption) {
      setFieldTouched(name, true);
      setFieldValue(name, selectedOption.value);

      if (onChangeCB)
        onChangeCB(selectedOption.value);
    }
  }

  return (
    <FormControl sx={{ width: '100%', height: '35px', ...sx }}>
      <Select
        // @ts-ignore
        value={values[name]} required
        placeholder={`${<Trans>select</Trans>}`}
        labelId=""
        id={id || ''}
        label={<Trans>{label}</Trans>}
        size="small"
        onChange={(e) => handleFieldValueChange(e.target.value)}
        className={additionalClass}
        defaultValue="" // prevent DOM error for undefined value
      >
        {options.map((option: DropdownOption, i: number) => <MenuItem value={option.value} key={`${id || ''}-dropdown-option-${i}`}>{option.label}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

export default BaseDropDown;