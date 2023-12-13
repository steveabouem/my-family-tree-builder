import { createContext } from "react";
import { DGlobalContext, applicationEnum, themeEnum } from "./definitions";

const GlobalContext = createContext<DGlobalContext>({
  app: applicationEnum.FT,
  theme: themeEnum.green,
  session: undefined,
});

export default GlobalContext;