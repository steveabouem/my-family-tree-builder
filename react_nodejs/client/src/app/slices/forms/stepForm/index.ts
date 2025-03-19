import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DStepFormState } from "../../definitions";
import { DFormField } from "@components/common/definitions";
import FamilyTreeService from "services/familyTree/familyTree.service";


const initialState: DStepFormState = {
  currentFormStep: 0,
  updating: true,
  currentFormStepFields: [],
};

const switchStep = (state: DStepFormState, action: PayloadAction<number>): DStepFormState => {
  state.updating  = true;
  state.currentFormStep = action.payload;
  state.updating  = false;
  return state;
};
const goToNext = (state: DStepFormState): DStepFormState => {
  state.updating  = true;
  state.currentFormStep  ++;
  state.updating  = false;
  return state;
};
const goToPrev = (state: DStepFormState): DStepFormState => {
  state.updating  = true;
  if (state.currentFormStep > 0) {
    state.currentFormStep  --;
  }
  state.updating  = false;
  return state;
};
/*
* sends field values to API, which returns next field set
*/
const setCurrentFields = (state: DStepFormState, action: PayloadAction<DFormField[]>) => {
  state.updating = true;
  state.currentFormStepFields = action.payload;
  state.updating = false;
};
const getCurrentFields = (state: DStepFormState) => {
  state.updating = true;
  state.currentFormStepFields = state.currentFormStepFields;
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
  //   state.currentFormStepFields = newFields;
  // })
  // state.updating = false;
  return state;
};

export const stepFormSlice = createSlice({
  name: 'FORM_STEPS',
  initialState,
  reducers: {
    changeformStepAction: switchStep,
    fetchNextStepFields: fetchFields,
    getStepFormValues: getCurrentFields,
    loadStepFormFieldsAction: setCurrentFields,
    nextFormStepAction: goToNext,
    prevFormStepAction: goToPrev,
  }
});
export const {changeformStepAction, nextFormStepAction,prevFormStepAction, loadStepFormFieldsAction, getStepFormValues, fetchNextStepFields} = stepFormSlice.actions;
export default stepFormSlice.reducer;