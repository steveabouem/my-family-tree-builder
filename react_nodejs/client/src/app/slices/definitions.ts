import { DFormField } from "@components/common/definitions";
import { ReactNode } from "react";

export type DStepFormState = {
  stepTree?: {[name: string]: DFormField[]}, // TODO: this is required. Optional for now due to time constraints
  currentFormStepDetails: DStepDetails;
  currentFormStep: number;
  updating: boolean;
  globalValues: any;
  totalSteps?: number;
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