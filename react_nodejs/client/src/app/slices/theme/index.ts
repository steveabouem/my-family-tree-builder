import { DThemeState, ThemeSeasons } from "../definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
* State
*/
const previousTheme = localStorage.getItem('ZTheme');
const initialState: DThemeState = {
  // @ts-ignore
  season: previousTheme || ThemeSeasons.spring,
};

/*
* mutators
*/
const changeSeason = (state: DThemeState, action: PayloadAction<ThemeSeasons>) => {
  state.season = action.payload;
  localStorage.setItem('ZTheme', action.payload);
  return state;
};
/*
* Slice (reducer)
*/
export const themeSlice = createSlice({
  initialState,
  name: 'THEME',
  reducers: {
    switchThemeAction: changeSeason
  }
});
export const {switchThemeAction} = themeSlice.actions;
export default themeSlice.reducer;