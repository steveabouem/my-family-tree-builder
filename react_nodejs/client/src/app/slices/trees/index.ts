import { DFamilyTreeState } from "../definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
* State
*/
const initialState: DFamilyTreeState = {
  updating: true,
  name: '',
  treeId: 0
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
const saveTreeId = (state: DFamilyTreeState, action: PayloadAction<number>) => {
  state.updating = true;
  state.treeId = action.payload;
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
    saveTreeIdAction: saveTreeId, // this is duplicating info, it should go in the currentTree object
    toggleTreeLoadingAction: toggleLoading
  }
});
export const {
  populateTreeAction, toggleTreeLoadingAction, saveTreeIdAction
} = familyTreeSlice.actions;
export default familyTreeSlice.reducer;