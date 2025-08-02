export interface DStepForm<V> {
  sx?: {[key: string]: string | number};
  handleSave: () => void;
  handleNext?: (step: number) => void;
  handlePrev?: (step: number) => void;
}