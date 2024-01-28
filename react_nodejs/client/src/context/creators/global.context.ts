import { createContext } from "react";
import { DGlobalContext, themeEnum } from "../definitions";

const GlobalContext = createContext<DGlobalContext>({
  theme: themeEnum.green,
  session: undefined,
  modal: {
    hidden: true,
    content: '',
    title: '',
    id: 'app-modal'
  },
  tree: {},
  updateTheme: undefined,
  updateModal: undefined,
  updateFamilyTree: undefined,
});

export default GlobalContext;