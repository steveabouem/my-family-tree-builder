import { DFamilyTreeDTO } from "services/api.definitions";
import { DFamilyTreeState } from "../definitions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/*
* State
*/
const initialState: DFamilyTreeState = {
  updating: true,
  name: '',
  treeId: 0,
  list: []
};

/*
* mutators
*/
const updateTree = (state: DFamilyTreeState, action: PayloadAction<DFamilyTreeDTO>) => {
  state.updating = true;
  state.currentFamilyTree = {...action.payload };
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
const saveTreeList = (state: DFamilyTreeState, action: PayloadAction<any>) => {
  state.updating = true;
  state.list = action.payload;
  state.updating = false;
};
const resetTree = (state: DFamilyTreeState) => {
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