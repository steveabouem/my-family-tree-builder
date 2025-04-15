import { DFormField } from "@components/common/definitions";
import { DFamilyMemberDTO, DFamilyTreeDTO } from "@services/api.definitions";
import { ReactNode } from "react";
// stepform
export type DStepFormState = {
  currentFormStepDetails: DStepDetails;
  currentFormStep: number;
  updating: boolean;
  globalValues: any;
  totalSteps: number;
  stepTree?: { [name: string]: DFormField[] | DFormField[][] };
};
export interface DStepDetails {
  name: string;
  fields: DFormField[] | DFormField[][];
  title?: ReactNode;
  subtitle?: ReactNode;
}
export type DChangeStepPayload = {
  success: boolean;
};

//family tree
export interface DFamilyTreeState {
  updating: boolean;
  currentFamilyTree?: DFamilyTreeDTO;
  name?: string;
}