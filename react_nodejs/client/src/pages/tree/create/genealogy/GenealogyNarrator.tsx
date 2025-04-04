import React, { useState } from 'react'
import { useZDispatch, useZSelector } from 'app/hooks';
import { DFamilyTreeState, DStepFormState } from 'app/slices/definitions';
import { DFamilyTreeDAO } from '@services/api.definitions';
import { useFormikContext } from 'formik';
import TreeLayout from 'pages/tree/layout/TreeLayout';

export const GenealogyNarrator = () => {
  const {currentFamilyTree, updating } = useZSelector<DFamilyTreeState>(state => state.tree);

  return  currentFamilyTree ? (
  <TreeLayout tree={currentFamilyTree || {}} />     
  ) : '';
};

export default GenealogyNarrator;