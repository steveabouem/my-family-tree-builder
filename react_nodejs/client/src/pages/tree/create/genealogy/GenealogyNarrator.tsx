import React, { useState } from 'react'
import { useZSelector } from 'app/hooks';
import { DFamilyTreeState } from 'app/slices/definitions';
import TreeLayout from 'pages/tree/layout/TreeLayout';
import DataProgress from 'components/common/progressIndicators/DataProgress';

export const GenealogyNarrator = () => {
  const {currentFamilyTree } = useZSelector<DFamilyTreeState>(state => state.tree);

  return  currentFamilyTree ? (
  <TreeLayout tree={currentFamilyTree} />     
  ) : <DataProgress />;
};

export default GenealogyNarrator;