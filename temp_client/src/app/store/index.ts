import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import stepFormReducer from "../slices/forms/stepForm";
import familyTreeReducer from "../slices/trees";
import themeReducer from "../slices/theme";
import languageReducer from "../slices/lang";
import userReducer from "../slices/user";
// TODO: refactor is needed to address non serializable paths (properties) in the slices: see https://redux.js.org/style-guide/#do-not-put-non-serializable-values-in-state-or-actions

const persistConfig = {
  key: "root", // Key for the storage
  storage,     // The storage medium (localStorage, sessionStorage, etc.)
  whitelist: ["user"], // Specify which slices of state to persist
  // blacklist: ['someOtherSlice'] // Optionally, specify which slices to ignore
};
const rootReducer = combineReducers({
  user: userReducer,
  stepForm: stepFormReducer,
  tree: familyTreeReducer,
  theme: themeReducer,
  language: languageReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { // Prevents errors related to non-serializable values in actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store)
export type ZRootState = ReturnType<typeof store.getState>;
export type ZDispatch = typeof store.dispatch;
export type ZStore = typeof store;