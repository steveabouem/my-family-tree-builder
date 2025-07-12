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
    transferData: undefined,
    id: 'app-modal',
    buttons: {cancel: true, confirm: true}
  },
  updateModal: () => {},
  tree: {},
  updateTheme: undefined,
  toggleLoading: () => {},
});

export default GlobalContext;