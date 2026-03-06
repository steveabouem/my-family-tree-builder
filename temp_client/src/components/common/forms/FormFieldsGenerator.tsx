import React from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { PiAsteriskSimpleFill } from 'react-icons/pi';
import { Box, Typography, Paper, Button, FormControl, MenuItem } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { BaseFormProps, FormField } from "types";
import CustomField from "./customField/CustomField";
import ImageField from "./imageField";

const FormFieldsGenerator = ({
  fields, handleSubmit, withPaper = true, name = 'form',
  size, handleFieldValueChange, title, mode = 'write', locked,
}: BaseFormProps): JSX.Element => {
  const { submitForm, values } = useFormikContext<any>();

  return (
    <Paper elevation={withPaper ? 1 : 0} sx={{ width: '100%', padding: '1rem', display: "flex", flexDirection: "column", gap: "1rem", border: 'none' }}>
      {title ? <Typography variant="h4">{title}</Typography> : null}
      {fields.map((field: FormField, i: number) => {
        const readValue = field.type === 'password' ? '****************' : values?.[field.fieldName] || '';
        
        return (
          <Box display="flex" flexDirection="column" gap={2} key={`${name}-fields-wrapper-${i}`}>
            <Typography variant="subtitle2" pt="1rem" pb="0">
              {field.label}{field.required ? <PiAsteriskSimpleFill className="bg-accent" /> : null}
            </Typography>
            {mode === 'write' ? (
              <>
                {field.subComponent ? (
                  <CustomField id={field?.id || ''} name={field.fieldName} value={field.subComponent.displayValue}
                    required={!!field.required} component={field.subComponent} key={`${field.fieldName}-custom`} />
                ) : field.type === 'array' ? (
                  <FieldArray name={field.fieldName} render={fields => field.subComponent} key={`${field.fieldName}-array`} /> // TODO: this is incorrect
                ) : field.type === 'select' ? (
                  <FormControl aria-label="Default select example" key={`${field.fieldName}-select`}>
                    {field?.options?.map((o, i) => <MenuItem value={o?.value} key={`select-option-${o?.label || ''}-${i}`}>{o?.label || '_'}</MenuItem>)}
                  </FormControl>
                ) : field.type === 'image' ? (
                  <FormControl>
                    <ImageField id={field?.id || ''} name={field.fieldName} required={!!field.required}
                      key={`${field.fieldName}-image`} />
                  </FormControl>
                ) : (
                  <Field
                    id={field?.id || ''} name={field.fieldName} value={values[field.fieldName]}
                    required={!!field.required} type={field?.type || 'text'} key={`${field.fieldName}-input`}
                  />
                )}
              </>
            ) : (
              <Typography variant="body1">{readValue}</Typography>
            )}
          </Box>
        );
      })}
      {locked || mode === 'read' ? '' : (
        <Box display="flex" justifyContent="end" width="100%">
          <Button variant="contained" color="success" onClick={submitForm}><Trans>submit</Trans></Button>
        </Box>
      )}
    </Paper>
  );
}

export default FormFieldsGenerator;

/*
* ORGANIZE FIELDS BY COLUMNS / ROWS. Either that or have props for sections (with section title). Otherwise, simply make a dedicated component for the tree form
*/

// import React, { useMemo } from "react";
// import { Field, FieldArray, useFormikContext } from "formik";
// import { PiAsteriskSimpleFill } from 'react-icons/pi';
// import { Box, Typography, Paper, Button, FormControl, MenuItem } from "@mui/material";
// import { Trans, t } from "@lingui/macro";
// import { BaseFormProps, FormField } from "types";
// import CustomField from "./customField/CustomField";
// import ImageField from "./imageField";
// import BoxColumn from "../containers/row/BoxColumn";

// const FormFieldsGenerator = ({ withPaper = true, rows = 1, name = 'form', mode = 'write', ...rest }: BaseFormProps): JSX.Element => {
//   const { submitForm, values } = useFormikContext<any>();
//   const fieldRows = organizeFieldsByRows(rows);

//   function organizeFieldsByRows(fieldRowCount: number) {
//     const fieldCount = rest.fields.length;
//     const rowLength = Math.ceil(fieldCount / fieldRowCount);
//     const fieldRowsMapping: any = {};

//     for (let i = 0; i < fieldRowCount; i++) {
//       fieldRowsMapping[i] = [];
//     }

//     let currentRow = 0;

//     rest.fields.forEach(field => {
//       fieldRowsMapping[currentRow].push(field);

//       if (fieldRowsMapping[currentRow].length >= rowLength) {
//         currentRow++;
//       }
//     });

//     return fieldRowsMapping;
//   };
//   function renderFieldRows() {
//     const list = fieldRows.map((f: any) => {
//       let result = f.map((field: FormField, i: number) => {
//         const readValue = field.type === 'password' ? '****************' : values?.[field.fieldName] || '';
  
//         return (
//           <BoxColumn key={`${name}-fields-column-${i}`}>

//           <Box display="flex" flexDirection="column" gap={2}>
//             <Typography variant="subtitle2" pt="1rem" pb="0">
//               {field.label}{field.required ? <PiAsteriskSimpleFill className="bg-accent" /> : null}
//             </Typography>
//             {mode === 'write' ? (
//               <>
//                 {field.subComponent ? (
//                   <CustomField id={field?.id || ''} name={field.fieldName} value={field.subComponent.displayValue}
//                     required={!!field.required} component={field.subComponent} key={`${field.fieldName}-custom`} />
//                 ) : field.type === 'array' ? (
//                   <FieldArray name={field.fieldName} render={fields => field.subComponent} key={`${field.fieldName}-array`} /> // TODO: this is incorrect
//                 ) : field.type === 'select' ? (
//                   <FormControl aria-label="Default select example" key={`${field.fieldName}-select`}>
//                     {field?.options?.map((o, i) => <MenuItem value={o?.value} key={`select-option-${o?.label || ''}-${i}`}>{o?.label || '_'}</MenuItem>)}
//                   </FormControl>
//                 ) : field.type === 'image' ? (
//                   <FormControl>
//                     <ImageField id={field?.id || ''} name={field.fieldName} required={!!field.required}
//                       key={`${field.fieldName}-image`} />
//                   </FormControl>
//                 ) : (
//                   <Field
//                     id={field?.id || ''} name={field.fieldName} value={values[field.fieldName]}
//                     required={!!field.required} type={field?.type || 'text'} key={`${field.fieldName}-input`}
//                   />
//                 )}
//               </>
//             ) : (
//               <Typography variant="body1">{readValue}</Typography>
//             )}
//           </Box>
//           </BoxColumn>
//         );
//       });

//       return result;
//     });

//     return list;
//   }

//   return (
//     <Paper elevation={withPaper ? 1 : 0} sx={{ width: '100%', padding: '1rem', display: "flex", flexDirection: "column", gap: "1rem", border: 'none' }}>
//       {rest?.title ? <Typography variant="h4">{rest.title}</Typography> : null}
//       {renderFieldRows()}
//       {rest?.locked || mode === 'read' ? '' : (
//         <Box display="flex" justifyContent="end" width="100%">
//           <Button variant="contained" color="success" onClick={submitForm}><Trans>submit</Trans></Button>
//         </Box>
//       )}
//     </Paper>
//   );
// }

// export default FormFieldsGenerator;