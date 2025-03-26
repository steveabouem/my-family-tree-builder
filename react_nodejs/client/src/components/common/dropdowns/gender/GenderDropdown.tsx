import React from 'react'
import BaseDropDown from '../BaseDropdown';
import { genderOptions } from './definitions';
import { DBaseDropDownProps } from '../definitions';

const GenderDropdown = (props: Pick<DBaseDropDownProps<any>, 'name' | 'sx' >) => {
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
