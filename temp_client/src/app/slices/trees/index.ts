import { FamilyTreeRecord,FamilyTreeState } from "types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
* State
*/
const initialState: FamilyTreeState = {
  updating: true,
  name: '',
  treeId: 0,
  list: [],
  currentFamilyTree: undefined
};

/*
* mutators
*/
const updateTree = (state: FamilyTreeState, action: PayloadAction<FamilyTreeRecord>) => {
  state.updating = true;
  state.currentFamilyTree = {...action.payload };
  state.updating = false;
  return state;
};
const saveTreeId = (state: FamilyTreeState, action: PayloadAction<number>) => {
  state.updating = true;
  state.treeId = action.payload;
  state.updating = false;
  return state;
};
const toggleLoading = (state: FamilyTreeState, action: PayloadAction<void>) => {

};
const saveTreeList = (state: FamilyTreeState, action: PayloadAction<any>) => {
  state.updating = true;
  state.list = action.payload;
  state.updating = false;
};
const resetTree = (state: FamilyTreeState) => {
  state.updating = true;
  state = {...initialState};
  state.updating = false;
  return state;
}
/*
* Slice (reducer)
*/
export const familyTreeSlice = createSlice({
  name: 'FAMILY_TREE',
  initialState,
  reducers: {
    populateTreeAction: updateTree,
    saveTreeIdAction: saveTreeId, // this is duplicating info, it should go in the currentTree object
    toggleTreeLoadingAction: toggleLoading,
    saveTreesListAction: saveTreeList,
    resetAction: resetTree
  }
});
export const {
  populateTreeAction, toggleTreeLoadingAction, saveTreeIdAction, saveTreesListAction, resetAction
} = familyTreeSlice.actions;
export default familyTreeSlice.reducer;