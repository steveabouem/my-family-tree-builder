import React, { useState } from "react";
import { useFormikContext } from "formik";
import { FormControl, Select, MenuItem } from "@mui/material";
import { Trans } from "@lingui/macro";
import { BaseDropDownProps, DropdownOption } from "types";

const BaseDropDown = ({ id, label, name, options, additionalClass, onChangeCB, sx, selectedOption }: BaseDropDownProps): JSX.Element => {
  const [currentOption, setCurrentOption] = useState<string | undefined>();
  const { setFieldValue, setFieldTouched, values } = useFormikContext<any>();

  function handleFieldValueChange(optionname: string | number) {
    const currentOption = options.find((option: DropdownOption) => option.value === optionname);

    if (currentOption) {
      setFieldTouched(name, true);
      setFieldValue(name, currentOption.value);
      setCurrentOption(currentOption.label);

      if (onChangeCB)
        onChangeCB(currentOption.value);
    }
  }

  return (
    <FormControl sx={{ width: '100%', height: '35px', ...sx }}>
      <Select
        // @ts-ignore
        value={values[name]} required
        variant="standard"
        placeholder={`${<Trans>select</Trans>}`}
        labelId=""
        id={id || ''}
        label={<Trans>{label}</Trans>}
        size="small"
        onChange={(e) => handleFieldValueChange(e.target.value)}
        className={additionalClass}
        defaultValue="" // prevent DOM error for undefined value
      >
        {options.map((option: DropdownOption, i: number) => {
          const isSelected = currentOption === option.label || selectedOption?.label === option.label;

          return (
            <MenuItem
              value={option.value}
              key={`${id || ''}-dropdown-option-${i}`}
              selected={isSelected}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default BaseDropDown;