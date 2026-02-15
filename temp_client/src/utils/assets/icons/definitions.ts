import { ReactNode } from "react";

export interface IconProps  {
  link?: boolean;
  sx?: {[key:string]: string | number};
  color?: string;
  size?: number;
  tooltip?: {active: boolean, text: string | ReactNode},
  onClick?: () => void;
}