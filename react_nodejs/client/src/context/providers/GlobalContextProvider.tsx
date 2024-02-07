import React, { useState } from 'react';
import { DContextProvider, themeEnum } from '../definitions';
import { DModalProps } from '../../components/common/alerts/definitions';
import GlobalContext from '../creators/global.context';

const GlobalContextProvider = ({ children }: DContextProvider) => {
  const [theme, setTheme] = useState<themeEnum>(themeEnum.dark);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalContent, setModalContent] = useState<Partial<DModalProps>>({hidden: true});

  const updateTheme = (value: themeEnum): void => {
    setTheme(() => value);
  };
  
  const updateModal = (values?: Partial<DModalProps>): void => {
    setModalContent((currentContent) => ({ ...currentContent, ...values }));
  };

  const toggleLoading = (state: boolean) =>  {
    setLoading(state);
  };

  return (
    <GlobalContext.Provider value={{modal: modalContent, updateModal, theme, updateTheme, toggleLoading, loading}}>
      {children}
    </GlobalContext.Provider>
  )
};

export default GlobalContextProvider;
