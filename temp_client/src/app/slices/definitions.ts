import { FormField } from "components/common/definitions";
import { FamilyTree, User } from "services/api.definitions";
import { ReactNode } from "react";

// theme
export interface ThemeState {
  season: ThemeSeasons;
};
export enum ThemeSeasons {
'fall' = 'fall' ,
'winter' = 'winter' ,
'spring'= 'spring',
'summer'= 'summer',
'default'= 'default',
};
// stepform
export type DStepFormState = {
  currentFormStepDetails: StepDetails;
  currentFormStep: number;
  updating: boolean;
  globalValues: any;
  totalSteps: number;
  stepTree?: { [name: string]: FormField[] };
  mode?: string;
};
export interface StepDetails {
  name: string;
  fields: FormField[];
  title?: ReactNode;
  subtitle?: ReactNode;
}
export type DChangeStepPayload = {
  success: boolean;
};

export enum stepFormModes {
  'edit' = 'edit',
  'create' = 'create',
}
//family tree
export interface FamilyTreeState {
  updating: boolean;
  treeId: number;
  currentFamilyTree?: FamilyTree;
  name?: string;
  list: any[];
}

// user
export interface UserState {
  updating: boolean;
  currentUser?: LoggedInUser;
}

export type LoggedInUser = Partial<User> & {authenticated?: boolean};