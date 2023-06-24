import { DeepPartial } from "redux";

// +++++=> NAVIGATION <= +++++
export interface DTopNavProps {
links: DNavigationLink[];
position: string;
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

// +++++=> FORMS <= +++++
export interface DFormField {
  fieldName: string;
  label: string;
  class?: string;
  id?: string;
  required?: boolean

}

export interface DBaseFormProps {
  fields: DFormField[];
  initialValues?: {[key: string]: string | number};
  // TODO: No any, valiation types are not hard
  validations?: any;
}