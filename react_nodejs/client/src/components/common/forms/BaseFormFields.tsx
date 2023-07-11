import React from "react";
import { Field } from "formik";
import { DBaseFormProps, DFormField } from "../definitions";
import ButtonRounded from "../buttons/Rounded";
import('./styles.scss');

const BaseFormFields = ({ fields, handleSubmit, size }: DBaseFormProps): JSX.Element => {
  return (
    <div className={`base-form-fields accent-bg primary ${size}`}>
      {fields.map((p_field: DFormField, i: number) => (
        <div key={`${i}-${p_field.fieldName}`} className="field-wrap base">
          <label htmlFor={p_field.fieldName} className="primary">{p_field.label}</label>
          <Field id={p_field?.id || ''} name={p_field.fieldName} required={!!p_field.required} />
        </div>
      ))}
      <div>
        <ButtonRounded action={handleSubmit} />
      </div>
    </div>
  );
}

export default BaseFormFields;