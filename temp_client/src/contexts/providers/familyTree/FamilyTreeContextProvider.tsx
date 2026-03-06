import React, { ReactNode } from 'react';
// import { DFamilyDTO } from '../../components/family/definitions';
import { FamilyTree } from 'types';
import FamilyTreeContext from 'contexts/creators/familyTree/familyTree.context';

const FamilyTreeContextProvider = ({ children }: {children: ReactNode}) => {
  const [familyTrees, setFamilyTrees] = React.useState<Partial<FamilyTree>[]>([]);
  const [currentFamilyTree, setCurrentFamilyTree] = React.useState<Partial<FamilyTree>>({});


  const updateFamilyTrees = (values?: Partial<FamilyTree>[]): void => {
    const newTreeIds = values?.filter(tree => !familyTrees.find(t => t.id === tree.id));
    setFamilyTrees([...familyTrees, ...newTreeIds || []]);
  };

  const updateCurrentFamilyTree = (values?: Partial<FamilyTree>): void => {
    
    setCurrentFamilyTree({...currentFamilyTree, ...values});
  };

  return (
    <FamilyTreeContext.Provider value={{ familyTrees, currentFamilyTree, updateCurrentFamilyTree, updateFamilyTrees } }>
      {children}
    </FamilyTreeContext.Provider>
  )
};

export default FamilyTreeContextProvider;
