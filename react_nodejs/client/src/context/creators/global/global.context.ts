import { DGlobalContext, themeEnum } from "contexts/creators/global/globalContext.types";
import { createContext } from "react";

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
  toggleLoading: () => {},
});

export default GlobalContext;