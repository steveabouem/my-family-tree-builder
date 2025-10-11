import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, APILoginResponse } from "types";

/*
* State
*/
const previousUser = localStorage.getItem(`${process.env.REACT_APP_LOCALE_STORAGE_NAME}`)
const initialState: UserState = {
  updating: false,
  currentUser: undefined,
};

/*
* mutators
*/
const updateUser = (state: UserState, action: PayloadAction<APILoginResponse  | undefined>) => {
  state.updating = true;
  if (action.payload) {
    state.currentUser = { ...state.currentUser, ...action.payload };
  } else {
    state.currentUser = undefined;
  }
  state.updating = false;
  return state;
};

const setUser = (state: UserState, action: PayloadAction<APILoginResponse>) => {
  state.updating = true;
  state.currentUser = action.payload;
  state.updating = false;
  return state;
};

const clearUser = (state: UserState) => {
  state.updating = true;
  state.currentUser = undefined;
  state.updating = false;
  return state;
};

const resetUser = (state: UserState) => {
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
    updateUserAction: updateUser,
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

