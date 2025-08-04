import React, { ReactNode } from 'react';
// import { DFamilyDTO } from '../../components/family/definitions';
import { DFamilyTree } from '../../../pages/tree/definitions';
import FamilyTreeContext from 'contexts/creators/familyTree/familyTree.context';

const FamilyTreeContextProvider = ({ children }: {children: ReactNode}) => {
  const [familyTrees, setFamilyTrees] = React.useState<Partial<DFamilyTree>[]>([]);
  const [currentFamilyTree, setCurrentFamilyTree] = React.useState<Partial<DFamilyTree>>({});


  const updateFamilyTrees = (values?: Partial<DFamilyTree>[]): void => {
    const newTreeIds = values?.filter(tree => !familyTrees.find(t => t.id === tree.id));
    setFamilyTrees([...familyTrees, ...newTreeIds || []]);
  };

  const updateCurrentFamilyTree = (values?: Partial<DFamilyTree>): void => {
    
    setCurrentFamilyTree({...currentFamilyTree, ...values});
  };

  return (
    <FamilyTreeContext.Provider value={{ familyTrees, currentFamilyTree, updateCurrentFamilyTree, updateFamilyTrees } }>
      {children}
    </FamilyTreeContext.Provider>
  )
};

export default FamilyTreeContextProvider;
