import React from "react";
import { Field } from "formik";
import { DBaseFormProps, DFormField } from "../definitions";

const BaseFormFields = ({ fields }: DBaseFormProps): JSX.Element => {

  return (
   
      <>
        {fields.map((p_field: DFormField, i: number) => (
          <div key={`${i}-${p_field.fieldName}`}>
            <label htmlFor={p_field.fieldName}>{p_field.label}</label>
            <Field id={p_field?.id || ''} name={p_field.fieldName} required={!!p_field.required} />
          </div>
        ))}
      </>
  )
}

export default BaseFormFields;