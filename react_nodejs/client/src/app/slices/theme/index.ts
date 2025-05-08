import { DThemeState, ThemeSeasons } from "../definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
* State
*/
const initialState: DThemeState = {
  season: ThemeSeasons.spring,
};

/*
* mutators
*/
const changeSeason = (state: DThemeState, action: PayloadAction<ThemeSeasons>) => {
  state.season = action.payload;
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