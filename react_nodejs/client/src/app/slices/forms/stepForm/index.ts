import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DStepDetails, DStepFormState, stepFormModes } from "../../definitions";
import FamilyTreeService from "services/familyTree/familyTree.service";

/*
* State
*/
const initialState: DStepFormState = {
  currentFormStep: 0,
  updating: true,
  currentFormStepDetails: { name: '', fields: [] }, // this should be renamed currentStepInfo
  globalValues: {},
  totalSteps: 1,
  mode: 'create'
};
/*
* mutators
*/
const setTotalStep = (state: DStepFormState, action: PayloadAction<number>) => {
  state.updating = true;
  state.totalSteps = action.payload;
  state.updating = false;
  return state;
};
const switchStep = (state: DStepFormState, action: PayloadAction<number>): DStepFormState => {
  /*
  * No need to worry about immutability here, redux already does a copy of the state for me
  */
  state.updating = true;
  state.currentFormStep = action.payload;
  state.updating = false;
  return state;
};
const goToNext = (state: DStepFormState): DStepFormState => {
  state.updating = true;
  state.currentFormStep++;
  state.updating = false;
  return state;
};
const goToPrev = (state: DStepFormState): DStepFormState => {
  state.updating = true;
  if (state.currentFormStep >= 1) {
    state.currentFormStep--;
  }
  state.updating = false;
  return state;
};
const changeMode = (state: DStepFormState, action: PayloadAction<stepFormModes>): DStepFormState => {
  state.updating = true;
  state.mode = action.payload;
  state.updating = false;
  return state;
};
/*
* sends field values to API, which returns next field set
*/
const setCurrentFields = (state: DStepFormState, action: PayloadAction<DStepDetails>) => {
  state.updating = true;
  const newStepTree = { ...state?.stepTree || {}, [action.payload.name as string]: action.payload.fields }
  state.stepTree = newStepTree;
  state.currentFormStepDetails = action.payload;
  state.updating = false;
};
const setStepFields = (state: DStepFormState, action: PayloadAction<DStepDetails & {step: number}>) => {
  state.updating = true;
  const newStepTree = { ...state?.stepTree || {}, [action.payload.name as string]: action.payload.fields }
  state.stepTree = newStepTree;
  state.totalSteps = action.payload.step;
  state.updating = false;
  return state;
};
const removeFieldsByStepName = (state: DStepFormState, action: PayloadAction<string>) => {
  state.updating = true;
  state.currentFormStepDetails = { name: action.payload, fields: [] };
  state.updating = false;
  return state;
};
const getCurrentFields = (state: DStepFormState) => {
  state.updating = true;
  state.currentFormStepDetails = state.currentFormStepDetails;
  state.updating = false;
};
const fetchFields = (state: DStepFormState, action: PayloadAction<number>) => {
  const familyTreeService = new FamilyTreeService();
  state.updating = true;
  // /*
  // * might setup a middleware for async, but I dont see the point since I'll still be using "thenable" functions
  // */
  // familyTreeService.getGenealogyFormFieldsForStep(action.payload)
  // .then((newFields: DFormField[]) => {
  //   state.currentFormStepDetails = newFields;
  // })
  state.updating = false;
  return state;
};
const getCombinedStepValues = () => { };
const setCombinedStepValues = <V,>(state: DStepFormState, action: PayloadAction<{ values: V }>) => {
  state.updating = true;
  state.globalValues = { ...state.globalValues, ...action.payload };
  state.updating = false;
};
/*
* Slice (reducer)
*/
export const stepFormSlice = createSlice({
  name: 'FORM_STEPS',
  initialState,
  reducers: {
    changeformStepAction: switchStep,
    fetchNextStepFields: fetchFields,
    getStepFormValuesAction: getCurrentFields,
    loadStepFormFieldsAction: setCurrentFields,
    populateStepAction: setStepFields,
    nextFormStepAction: goToNext,
    prevFormStepAction: goToPrev,
    updateGlobalValuesAction: setCombinedStepValues,
    getGlobalValuesAction: getCombinedStepValues,
    setStepsCountAction: setTotalStep,
    clearFieldsByStepName: removeFieldsByStepName,
    changeModeAction: changeMode
  }
});
export const {
  changeformStepAction, nextFormStepAction, prevFormStepAction, clearFieldsByStepName,
  loadStepFormFieldsAction, getStepFormValuesAction, fetchNextStepFields, populateStepAction,
  getGlobalValuesAction, updateGlobalValuesAction, setStepsCountAction, changeModeAction
} = stepFormSlice.actions;
export default stepFormSlice.reducer;