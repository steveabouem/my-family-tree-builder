import { DModalProps } from 'components/common/alerts/definitions';
import GlobalContext from 'contexts/creators/global/global.context';
import { themeEnum } from 'contexts/creators/global/globalContext.types';
import React, { ReactNode } from 'react';

const GlobalContextProvider = ({ children }: {children: ReactNode}) => {
  const [theme, setTheme] = React.useState<themeEnum>(themeEnum.dark);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [modalContent, setModalContent] = React.useState<Partial<DModalProps>>({hidden: true});

  const updateTheme = (value: themeEnum): void => {
    setTheme(() => value);
  };
  
  const updateModal = (values?: Partial<DModalProps>): void => {
    setModalContent((currentContent) => ({ ...currentContent, ...values }));
  };

  const toggleLoading = (state?: boolean) =>  {
    setLoading(state || false);
  };

  return (
    <GlobalContext.Provider value={{modal: modalContent, updateModal, theme, updateTheme, toggleLoading, loading}}>
      {children}
    </GlobalContext.Provider>
  )
};

export default GlobalContextProvider;
