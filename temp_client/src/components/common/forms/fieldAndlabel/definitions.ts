import { ReactNode } from "react";

export interface DFieldAndLabelProps {
  label: string | ReactNode;
  fieldName: string;
  direction: 'row' | 'column';
  required?: boolean;
  children?: ReactNode;
  fieldType?: string;
  sx?:  {[key:string]: string | number};
  labelStyles?:  {[key:string]: string | number};
  fieldStyles?:  {[key:string]: string | number};
}