import { ReactNode } from "react";
import { DModalProps } from "../components/common/alerts/definitions";
import { DFamilyTree } from "../components/tree/definitions";

export enum themeEnum {
  green = 'DARK-GREEN',
  light = 'LIGHT',
  dark = 'DARK',
}

export interface DGlobalContext {
  theme: themeEnum;
  session?: string;
  modal?: Partial<DModalProps>;
  tree?: Partial<DFamilyTree>;
  updateTheme?: (value: themeEnum) => void;
  updateModal?: (values: Partial<DModalProps>) => void;
  updateFamilyTree?: (values: Partial<DFamilyTree>) => void;
}

export interface DContextProvider {
  children?: ReactNode;
}