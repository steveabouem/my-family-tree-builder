import React from "react";
import { themeEnum } from "../../context/global.context";

// +++++=> NAVIGATION <= +++++
export interface DTopNavProps {
  links?: DNavigationLink[];
  position: string;
  handleChangeTheme: (theme: themeEnum) => void;
}

export interface DNavigationLink {
  link: string;
  path: string;
}

// +++++=> PAGES <= +++++
export interface DPageProps {
  isLoading: boolean;
  theme: themeEnum;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

// +++++=> FORMS <= +++++
export interface DFormField {
  fieldName: string;
  label: string;
  class?: string;
  id?: string;
  value?: string | number;
  required?: boolean;
  type?: string;
  subComponent?: any;
  updateValue?: () => void;
}

export interface DBaseFormProps {
  fields: DFormField[];
  handleSubmit: () => void;
  size: string;
  initialValues?: { [key: string]: string | number };
  handleFieldValueChange?: (field: string, value: string | number) => void;
  // TODO: No any, valiation types are not hard
  validations?: any;
}

export const cookieRoot = 'FT=';