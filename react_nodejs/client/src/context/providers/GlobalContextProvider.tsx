import React, { useState } from 'react';
import { DContextProvider, themeEnum } from '../definitions';
import { DModalProps } from '../../components/common/alerts/definitions';
import GlobalContext from '../creators/global.context';
import { DFamilyTree } from '../../components/tree/definitions';

const GlobalContextProvider = ({ children }: DContextProvider) => {
  const [theme, setTheme] = useState<themeEnum>(themeEnum.dark);
  const [modalContent, setModalContent] = useState<Partial<DModalProps>>({});
  const [familyTree, setFamilyTree] = useState<Partial<DFamilyTree>>({});

  const updateTheme = (value: themeEnum): void => {
    setTheme(() => value);
  };
  
  const updateModal = (values?: Partial<DModalProps>): void => {
    setModalContent({ ...modalContent, ...values });
  };

  const updateFamilyTree = (values?: Partial<DFamilyTree>): void => {
    setFamilyTree({ ...familyTree, ...values });
  };

  return (
    <GlobalContext.Provider value={{
      modal: modalContent, tree: familyTree, updateModal,
      updateFamilyTree, theme, updateTheme
    }}>
      {children}
    </GlobalContext.Provider>
  )
};

export default GlobalContextProvider;
