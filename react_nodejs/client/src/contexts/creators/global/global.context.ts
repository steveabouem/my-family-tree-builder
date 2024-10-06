import { createContext } from "react";
import { DGlobalContext, themeEnum } from "./globalContext.types";

const GlobalContext = createContext<DGlobalContext>({
  theme: themeEnum.green,
  session: undefined,
  loading: true,
  modal: {
    hidden: true,
    content: '',
    title: '',
    id: 'app-modal',
    buttons: {cancel: true, confirm: true}
  },
  tree: {},
  updateTheme: undefined,
  updateModal: undefined,
  toggleLoading: undefined,
});

export default GlobalContext;