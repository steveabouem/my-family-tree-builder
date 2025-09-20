import React from 'react'
import BaseDropDown from '../BaseDropdown';
import { BaseDropDownProps, genderOptions } from 'types';

const GenderDropdown = (props: Pick<BaseDropDownProps, 'name' | 'sx' >) => {
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
