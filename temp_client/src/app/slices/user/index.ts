import { DUserState } from "../definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "services/api.definitions";

/*
* State
*/
const previousUser = localStorage.getItem(`${process.env.REACT_APP_LOCALE_STORAGE_NAME}`)
const initialState: DUserState = {
  updating: false,
  currentUser: undefined,
};

/*
* mutators
*/
const manageUser = (state: DUserState, action: PayloadAction<Partial<User>>) => {
  console.log('store fn ', action);
  
  state.updating = true;
  state.currentUser = { ...state.currentUser, ...action.payload };
  state.updating = false;
  return state;
};

const setUser = (state: DUserState, action: PayloadAction<User>) => {
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
  initialState,
  name: 'USER',
  reducers: {
    updateUserAction: manageUser,
    setUserAction: setUser,
    clearUserAction: clearUser,
    resetUserAction: resetUser
  }
});

export const {
  updateUserAction,
  setUserAction,
  clearUserAction,
  resetUserAction
} = userSlice.actions;

export default userSlice.reducer;

