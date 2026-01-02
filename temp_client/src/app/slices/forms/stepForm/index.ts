import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormImageInfo, StepDetails, StepFormState, stepFormModes } from "types";

/*
* State
*/
const initialState: StepFormState = {
  currentFormStep: 0,
  updating: true,
  currentFormStepDetails: { name: '', fields: [] }, // this should be renamed currentStepInfo
  globalValues: {},
  totalSteps: 1,
  mode: 'create',
  files: []
};
/*
* mutators
*/
const setTotalStep = (state: StepFormState, action: PayloadAction<number>) => {
  state.updating = true;
  state.totalSteps = action.payload;
  state.updating = false;
  return state;
};
const changeFormStep = (state: StepFormState, action: PayloadAction<number>): StepFormState => {
  /*
  * No need to worry about immutability here, redux already does a copy of the state for me
  */
  state.updating = true;
  state.currentFormStep = action.payload;
  state.updating = false;
  return state;
};
const goToNextStep = (state: StepFormState): StepFormState => {
  state.updating = true;
  state.currentFormStep++;
  state.updating = false;
  return state;
};
const goToPrevStep = (state: StepFormState): StepFormState => {
  state.updating = true;
  if (state.currentFormStep >= 1) {
    state.currentFormStep--;
  }
  state.updating = false;
  return state;
};
const changeMode = (state: StepFormState, action: PayloadAction<stepFormModes>): StepFormState => {
  state.updating = true;
  state.mode = action.payload;
  state.updating = false;
  return state;
};

const setCurrentFields = (state: StepFormState, action: PayloadAction<StepDetails>) => {
  state.updating = true;
  const newStepTree = { ...state?.stepTree || {}, [action.payload.name as string]: action.payload.fields }
  state.stepTree = newStepTree;
  state.currentFormStepDetails = action.payload;
  state.updating = false;
};
const setStepFields = (state: StepFormState, action: PayloadAction<StepDetails & { step: number }>) => {
  state.updating = true;
  const newStepTree = { ...state?.stepTree || {}, [action.payload.name as string]: action.payload.fields }
  state.stepTree = newStepTree;
  state.totalSteps = action.payload.step;
  state.updating = false;
  return state;
};
const removeFieldsByStepName = (state: StepFormState, action: PayloadAction<string>) => {
  state.updating = true;
  state.currentFormStepDetails = { name: action.payload, fields: [] };
  state.updating = false;
  return state;
};
const getCurrentFields = (state: StepFormState) => {
  state.updating = true;
  state.updating = false;
};
const fetchFields = (state: StepFormState, action: PayloadAction<number>) => {
  state.updating = true;

  state.updating = false;
  return state;
};
const getCombinedStepValues = () => { };
const setCombinedStepValues = <V,>(state: StepFormState, action: PayloadAction<{ values: V }>) => {
  state.updating = true;
  state.globalValues = { ...state.globalValues, ...action.payload };
  state.updating = false;
};
const cleanup = (state: StepFormState) => {
  state.updating = true;
  state.currentFormStep = 0;
  state.currentFormStepDetails = { name: '', fields: [] };
  state.globalValues = {};
  state.totalSteps = 1;
  state.updating = false;
  state.stepTree = {};

  return state;
};
const toggleUpdating = (state: StepFormState, action: PayloadAction<boolean>) => {
  state.updating = action.payload;
  return state;
};

/*
* Slice (reducer)
*/
export const stepFormSlice = createSlice({
  name: 'FORM_STEPS',
  initialState,
  reducers: {
    changeformStepAction: changeFormStep,
    fetchNextStepFields: fetchFields,
    getStepFormValuesAction: getCurrentFields,
    loaStepFormFieldsAction: setCurrentFields,
    setStepFieldsAction: setStepFields,
    goToNextStepAction: goToNextStep,
    goToPrevStepAction: goToPrevStep,
    updateGlobalValuesAction: setCombinedStepValues,
    getGlobalValuesAction: getCombinedStepValues,
    setStepsCountAction: setTotalStep,
    clearFieldsByStepName: removeFieldsByStepName,
    changeModeAction: changeMode,
    cleanupAction: cleanup,
    toggleStepFormUpdatingAction: toggleUpdating,
  }
});

export const {
  changeformStepAction, goToNextStepAction, goToPrevStepAction, clearFieldsByStepName, cleanupAction,
  loaStepFormFieldsAction, getStepFormValuesAction, fetchNextStepFields, setStepFieldsAction,
  getGlobalValuesAction, updateGlobalValuesAction, setStepsCountAction, changeModeAction, toggleStepFormUpdatingAction
} = stepFormSlice.actions;
export default stepFormSlice.reducer;