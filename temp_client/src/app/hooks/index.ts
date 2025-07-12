import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import { ZDispatch, ZRootState, ZStore } from "../store";

export const useZDispatch: () => ZDispatch = useDispatch;
export const useZSelector: TypedUseSelectorHook<ZRootState> = useSelector;
export const useZStore: () => ZStore = useStore;