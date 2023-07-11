import React from "react";
import { themeEnum } from "../../context/global.context";

// +++++=> NAVIGATION <= +++++
export interface DTopNavProps {
links: DNavigationLink[];
position: string;
handleChangeTheme: (p_theme: themeEnum) => void;
}

export interface DNavigationLink {
  link: string;
  path: string;
}

export enum FTLinkEnums {
  home = '/ft/',
  user = 'users/',
  family = 'families/',
  familyTree = 'trees/',
  login = 'login',
  register = 'register',
}

// +++++=> PAGES <= +++++
export interface DPageProps {
  isLoading: boolean;
  theme: themeEnum;
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

// +++++=> FORMS <= +++++
export interface DFormField {
  fieldName: string;
  label: string;
  class?: string;
  id?: string;
  required?: boolean;
}

export interface DBaseFormProps {
  fields: DFormField[];
  handleSubmit:  () => void;
  size: string;
  initialValues?: {[key: string]: string | number};
  // TODO: No any, valiation types are not hard
  validations?: any;
}
