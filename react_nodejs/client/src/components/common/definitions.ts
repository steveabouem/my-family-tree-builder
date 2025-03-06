import React, { ReactElement, ReactNode } from "react";

/* +++++=> NAVIGATION <= +++++ */
// export interface DTopNavProps {
//   links?: DNavigationLink[];
//   position: string;
//   handleChangeTheme?: (theme: themeEnum) => void;
// }

export interface DNavigationLink {
  link: string  | ReactNode;
  path: string  | ReactNode;
}

/* +++++=> PAGES <= +++++ */
export interface DPageProps {
  title: string | ReactNode;
  subtitle: string | ReactNode;
  children?: React.ReactNode;
  loading?: boolean;
  bg?: string;
}

/* +++++=> FORMS <= +++++ */
export interface DFormField {
  fieldName: string;
  label: string | ReactNode;
  class?: string;
  id?: string;
  value?: string | number | ReactNode;
  required?: boolean;
  type?: string;
  subComponent?: any;
  updateValue?: () => void;
  options?: {label: string | ReactElement, value: any}[];
}

export interface DBaseFormProps {
  name?: string | ReactNode;
  withPaper?: boolean;
  mode?: 'read' | 'write',
  title?: string | ReactNode;
  fields: DFormField[];
  handleSubmit: () => void;
  size: string | ReactNode;
  initialValues?: any; // will switch to a generic soon
  handleFieldValueChange?: (field: string , value: string  | number) => void;
  // ! -TOFIX: No any, valiation types are not hard
  validations?: any;
}

/* +++++=> APP <= +++++ */

