import {configureStore} from "@reduxjs/toolkit";
import stepFormReducer from "../slices/forms/stepForm";

export const store = configureStore({
  reducer: {
    stepForm: stepFormReducer,
  }
});

export type ZRootState = ReturnType<typeof store.getState>;
export type ZDispatch = typeof store.dispatch;
export type ZStore = typeof store;