import {configureStore} from "@reduxjs/toolkit";
import stepFormReducer from "../slices/forms/stepForm";
import familyTreeReducer from "../slices/trees";
import themeReducer from "../slices/theme";
import languageReducer from "../slices/lang";
import userReducer from "../slices/user";
// TODO: refactor is needed to address non serializable paths (properties) in the slices: see https://redux.js.org/style-guide/#do-not-put-non-serializable-values-in-state-or-actions
export const store = configureStore({
  reducer: {
    stepForm: stepFormReducer,
    tree: familyTreeReducer,
    theme: themeReducer,
    language: languageReducer,
    user: userReducer
  }
});

export type ZRootState = ReturnType<typeof store.getState>;
export type ZDispatch = typeof store.dispatch;
export type ZStore = typeof store;