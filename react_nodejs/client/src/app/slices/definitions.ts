import { DFormField } from "@components/common/definitions";

export type DStepFormState = {
  currentFormStepFields: DFormField[];
  currentFormStep: number;
  updating: boolean;
};

export type DChangeStepPayload = {
  success: boolean;
};