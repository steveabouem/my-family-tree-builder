import { DFamilyTreeState } from "../definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
* State
*/
const initialState: DFamilyTreeState = {
  updating: true,
  name: ''
};

/*
* mutators
*/
const updateTree = (state: DFamilyTreeState, action: PayloadAction<any>) => {
  state.updating = true;
  state.currentFamilyTree = action.payload;
  state.updating = false;
  return state;
};
const toggleLoading = (state: DFamilyTreeState, action: PayloadAction<void>) => {

};
/*
* Slice (reducer)
*/
export const familyTreeSlice = createSlice({
  name: 'FAMILY_TREE',
  initialState,
  reducers: {
    populateTreeAction: updateTree,
    toggleTreeLoadingAction: toggleLoading
  }
});
export const {
  populateTreeAction, toggleTreeLoadingAction
} = familyTreeSlice.actions;
export default familyTreeSlice.reducer;