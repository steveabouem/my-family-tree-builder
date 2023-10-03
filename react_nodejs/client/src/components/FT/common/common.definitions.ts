import { ReactNode } from "react";
import { applicationEnum, themeEnum } from "../../../context/global.context";

export interface DAppProps {
  app?: applicationEnum
  children?: ReactNode;
}

export interface DThemeSelectorProps {
  switchTheme: (theme: themeEnum) => void;
}