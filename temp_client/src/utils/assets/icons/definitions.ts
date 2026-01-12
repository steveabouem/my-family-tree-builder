export interface IconProps  {
  link?: boolean;
  sx?: {[key:string]: string | number};
  color?: string;
  size?: number;
  tooltip?: {active: boolean, text: string},
  onClick?: () => void;
}