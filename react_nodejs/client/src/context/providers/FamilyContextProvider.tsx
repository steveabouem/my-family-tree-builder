import React, { useState } from 'react';
import FamilyTreeContext from '../creators/familyTree.context';
import { DContextProvider } from '../definitions';
import { DUserSession } from '../../services/auth/auth.definitions';
// import { DFamilyDTO } from '../../components/family/definitions';
import { DFamilyTree } from '../../components/tree/definitions';

const FamilyTreeContextProvider = ({children}: DContextProvider) => {
const [currentUser, setCurrentUser] = useState<Partial<DUserSession>>({});
const [tree, setTree] = useState<Partial<DFamilyTree>>({});
// const [family, setFamily] = useState<Partial<DFamilyDTO>>({});
// modal: { 
//   hidden: true,
//   content: '',
//   title: '',
//   id: 'app-modal'
// },
// updateModal: () => null,

  const updateUser = (values?: Partial<DUserSession>):void => {
    setCurrentUser({...currentUser, ...values});
  };

  return (
    <FamilyTreeContext.Provider value={{currentUser, tree, updateUser}}>
      {children}
    </FamilyTreeContext.Provider>
  )
};

export default FamilyTreeContextProvider;
