import React, { useEffect, useState } from 'react';
import FamilyTreeContext from '../creators/familyTree.context';
import { DContextProvider } from '../definitions';
import { DUserSession } from '../../services/auth/auth.definitions';
// import { DFamilyDTO } from '../../components/family/definitions';
import { DFamilyTree } from '../../components/tree/definitions';

const FamilyTreeContextProvider = ({ children }: DContextProvider) => {
  const [currentUser, setCurrentUser] = useState<Partial<DUserSession>>({});
  const [familyTrees, setFamilyTrees] = useState<Partial<DFamilyTree>[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('FT');

    if (storedUser) {
      const user = JSON.parse(storedUser);

      updateUser(user);
    }
  }, []);

  const updateUser = (values?: Partial<DUserSession>): void => {
    setCurrentUser({ ...currentUser, ...values });
  };

  const updateFamilyTrees = (values?: Partial<DFamilyTree>[]): void => {
    const newTreeIds = values?.filter(tree => !familyTrees.find(t => t.id === tree.id));
    setFamilyTrees([...familyTrees, ...newTreeIds || []]);
  };


  return (
    <FamilyTreeContext.Provider value={{ currentUser, familyTrees, updateUser, updateFamilyTrees }}>
      {children}
    </FamilyTreeContext.Provider>
  )
};

export default FamilyTreeContextProvider;
