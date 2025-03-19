import { DFormField } from "@components/common/definitions";

export interface DStepForm {
  sx?: {[key: string]: string | number};
  handleNext?: (step: number) => void;
  handlePrev?: (step: number) => void;
}