import { LanguageEnum, LanguageState } from "types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { i18n } from "@lingui/core";

const previousLang = localStorage.getItem('ZLn') as LanguageEnum;
const initialState: LanguageState = {
  current: previousLang || LanguageEnum.french,
};

const dynamicLinguiSwitch = async (ln: LanguageEnum) => {
  const content = await import(`../../../locales/${ln}/main.js`);
  i18n.load(ln, content);
  i18n.activate(ln);
};

const changeLang = (state: LanguageState, action: PayloadAction<LanguageEnum>) => {
  dynamicLinguiSwitch(action.payload)
    .then(() => {
      state.current = action.payload;
      localStorage.setItem('ZLn', action.payload);
    })
    .catch((e: unknown) => {
      console.log('Unable to switch lgng', e);
    });

  return state;
};

export const languageSlice = createSlice({
  initialState,
  name: 'Language',
  reducers: {
    switchLangAction: changeLang
  }
});
export const { switchLangAction } = languageSlice.actions;
export default languageSlice.reducer;