import { ReactNode } from "react";
import { DModalProps } from "../pages/common/alerts/definitions";
import { DFamilyTree } from "../pages/tree/definitions";

export enum themeEnum {
  green = 'DARK-GREEN',
  light = 'LIGHT',
  dark = 'DARK',
}

export interface DGlobalContext {
  theme: themeEnum;
  loading: boolean;
  session?: string;
  modal?: Partial<DModalProps>;
  tree?: Partial<DFamilyTree>;
  updateTheme?: (value: themeEnum) => void;
  updateModal?: (values: Partial<DModalProps>) => void;
  toggleLoading?: (value: boolean) => void;
}

export interface DContextProvider {
  children?: ReactNode;
}