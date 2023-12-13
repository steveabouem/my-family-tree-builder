import React from 'react';
import { FormikProps, useFormikContext } from 'formik';
import BaseDropDown from "./BaseDropdown"
import { DDropdownOption, maritalStatusOptions } from "./definitions"

const MaritalStatusDropdown = ({val, displayVal, id}: {val?: |string | number , displayVal?: string | number, id?: string}) => {
  // TODO: typing for generic below
  const { setFieldValue }: FormikProps<any> = useFormikContext();

  return (
    <BaseDropDown
      onValueChange={(option: DDropdownOption) => setFieldValue('marital_status', option.value)}
      options={maritalStatusOptions}
      id={id}
      val={val}
      displayVal={displayVal}
    />
  )
}

export default MaritalStatusDropdown;