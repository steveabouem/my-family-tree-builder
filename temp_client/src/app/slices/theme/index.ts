import { ThemeState, ThemeSeasons } from "types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
* State
*/
const previousTheme = localStorage.getItem('ZTheme');
const initialState: ThemeState = {
  // @ts-ignore
  season: previousTheme || ThemeSeasons.spring,
};

/*
* mutators
*/
const changeSeason = (state: ThemeState, action: PayloadAction<ThemeSeasons>) => {
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