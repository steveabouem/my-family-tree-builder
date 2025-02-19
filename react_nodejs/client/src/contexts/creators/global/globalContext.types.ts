import { DModalProps } from "components/common/alerts/definitions";
import { DFamilyTree } from "pages/tree/definitions";

export enum themeEnum {
  green = 'DARK-GREEN',
  light = 'LIGHT',
  dark = 'DARK',
};

export interface DGlobalContext {
  theme: themeEnum;
  loading: boolean;
  toggleLoading: (value: boolean) => void;
  session?: string;
  modal?: Partial<DModalProps>;
  tree?: Partial<DFamilyTree>;
  updateTheme?: (value: themeEnum) => void;
  updateModal?: (values: Partial<DModalProps>) => void;
};