import { DFormField } from "components/common/definitions";
import { DFamilyTreeDTO, DUserSession, User } from "services/api.definitions";
import { ReactNode } from "react";

// theme
export interface DThemeState {
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
  currentFormStepDetails: DStepDetails;
  currentFormStep: number;
  updating: boolean;
  globalValues: any;
  totalSteps: number;
  stepTree?: { [name: string]: DFormField[] };
  mode?: string;
};
export interface DStepDetails {
  name: string;
  fields: DFormField[];
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
export interface DFamilyTreeState {
  updating: boolean;
  treeId: number;
  currentFamilyTree?: DFamilyTreeDTO;
  name?: string;
  list: any[];
}

// user
export interface DUserState {
  updating: boolean;
  currentUser?: Partial<User>;
}