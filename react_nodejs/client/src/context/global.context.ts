import { createContext } from "react";

export enum applicationEnum {
  FT = 'FT',
  TR = 'TR',
}

export enum themeEnum {
  green = 'DARK-GREEN',
  light = 'LIGHT',
  dark = 'DARK',
}

interface DGlobalContext {
  app: applicationEnum;
  theme: themeEnum;
  session?: string;
}

const GlobalContext = createContext<DGlobalContext>({
  app: applicationEnum.FT,
  theme: themeEnum.green,
  session: undefined,
});

export default GlobalContext;