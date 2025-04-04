import {configureStore} from "@reduxjs/toolkit";
import stepFormReducer from "../slices/forms/stepForm";
import familyTreeReducer from "../slices/trees";

export const store = configureStore({
  reducer: {
    stepForm: stepFormReducer,
    tree: familyTreeReducer
  }
});

export type ZRootState = ReturnType<typeof store.getState>;
export type ZDispatch = typeof store.dispatch;
export type ZStore = typeof store;