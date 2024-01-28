import React, { ReactNode } from "react";
import { themeEnum } from "../../context/definitions";

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
  isLoading: boolean;
  title: string | ReactNode;
  subtitle: string | ReactNode;
  children?: React.ReactNode;
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
}

export interface DBaseFormProps {
  title?: string | ReactNode;
  fields: DFormField[];
  handleSubmit: () => void;
  size: string | ReactNode;
  initialValues?: { [key: string]: string | ReactNode | number };
  handleFieldValueChange?: (field: string , value: string  | number) => void;
  // ! -TOFIX: No any, valiation types are not hard
  validations?: any;
}

/* +++++=> APP <= +++++ */

