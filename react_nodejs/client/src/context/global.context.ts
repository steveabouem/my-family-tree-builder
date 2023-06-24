import { createContext } from "react";

export enum applicationEnum  {
  FT = 'FT',
  TR = 'TR',
}

const GlobalContext = createContext<applicationEnum>(applicationEnum.FT);

export default GlobalContext;