import { DFormField } from "@components/common/definitions";

export interface DStepForm {
  name: string;
  currentFields: DFormField[];
  currentStep: number;
  updateStep: (step: number) => void;
  sx?: {[key: string]: string | number};
}