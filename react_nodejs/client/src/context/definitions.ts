export enum applicationEnum {
  FT = 'FT',
  TR = 'TR',
}

export enum themeEnum {
  green = 'DARK-GREEN',
  light = 'LIGHT',
  dark = 'DARK',
}

export interface DGlobalContext {
  app: applicationEnum;
  theme: themeEnum;
  session?: string;
}
