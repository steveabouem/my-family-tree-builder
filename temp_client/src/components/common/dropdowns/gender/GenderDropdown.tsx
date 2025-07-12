import React from 'react'
import BaseDropDown from '../BaseDropdown';
import { DBaseDropDownProps, genderOptions } from '../definitions';

const GenderDropdown = (props: Pick<DBaseDropDownProps, 'name' | 'sx' >) => {
  return (
    <BaseDropDown
      name={props.name}
      options={genderOptions}
      id="gender-selection"
      sx={{ height: '1rem', ...props?.sx || {} }}
    />
  );
};

export default GenderDropdown;
