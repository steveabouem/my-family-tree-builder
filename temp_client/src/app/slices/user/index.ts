import { DUserState } from "../definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DUserSession } from "services/api.definitions";

/*
* State
*/
const initialState: DUserState = {
  updating: false,
  currentUser: undefined,
};

/*
* mutators
*/
const manageUSer = (state: DUserState, action: PayloadAction<Partial<DUserSession>>) => {
  state.updating = true;
  state.currentUser = { ...state.currentUser, ...action.payload };
  state.updating = false;
  return state;
};

const setUser = (state: DUserState, action: PayloadAction<DUserSession>) => {
  state.updating = true;
  state.currentUser = action.payload;
  state.updating = false;
  return state;
};

const clearUser = (state: DUserState) => {
  state.updating = true;
  state.currentUser = undefined;
  state.updating = false;
  return state;
};

const toggleUserLoading = (state: DUserState, action: PayloadAction<boolean>) => {
  state.updating = action.payload;
  return state;
};

const resetUser = (state: DUserState) => {
  state.updating = true;
  state = { ...initialState };
  state.updating = false;
  return state;
};

/*
* Slice (reducer)
*/
export const userSlice = createSlice({
  name: 'USER',
  initialState,
  reducers: {
    updateUserAction: manageUSer,
    setUserAction: setUser,
    clearUserAction: clearUser,
    toggleUserLoadingAction: toggleUserLoading,
    resetUserAction: resetUser
  }
});

export const {
  updateUserAction,
  setUserAction,
  clearUserAction,
  toggleUserLoadingAction,
  resetUserAction
} = userSlice.actions;

export default userSlice.reducer;
