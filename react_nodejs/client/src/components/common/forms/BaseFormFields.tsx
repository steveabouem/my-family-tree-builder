import React from "react";
import { Field, FieldArray } from "formik";
import { DBaseFormProps, DFormField } from "../definitions";
import ButtonRounded from "../buttons/Rounded";
import { PiAsteriskSimpleFill } from 'react-icons/pi';
import('./styles.scss');

const BaseFormFields = ({ 
  fields, handleSubmit, 
  size, handleFieldValueChange, title 
}: DBaseFormProps): JSX.Element => {

  return (
    <div className={`base-form-fields accent-bg primary ${size}`}>
      {title ? <div className="form-title">{title}</div> : null}
      {fields.map((field: DFormField, i: number) => (
        <div key={`${i}-${field.fieldName}`} className="field-wrap base">
          <label htmlFor={field.fieldName} className="primary">
            {field.label}{field.required ? <PiAsteriskSimpleFill className="bg-accent" /> : null}
          </label>
          {field.subComponent ? (
            <Field 
              id={field?.id || ''} name={field.fieldName} value={field.subComponent.displayValue}
              required={!!field.required} component={field.subComponent}/>
          ) : field.type === 'array' ? (
            <FieldArray name={field.fieldName} render={fields => field.subComponent} />
          ) : (
            <Field 
              id={field?.id || ''} name={field.fieldName} value={field.value}
              required={!!field.required} type={field?.type || 'input'}
            />
          )}
        </div>
      ))}
      <div>
        <ButtonRounded action={handleSubmit} />
      </div>
    </div>
  );
}

export default BaseFormFields;