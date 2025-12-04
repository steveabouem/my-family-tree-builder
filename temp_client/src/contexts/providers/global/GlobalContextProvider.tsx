import React, { ReactNode } from 'react';
import { ModalProps, themeEnum } from 'types';
import GlobalContext from 'contexts/creators/global/global.context';

const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = React.useState<themeEnum>(themeEnum.dark);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [modalContent, setModalContent] = React.useState<Partial<ModalProps>>({ hidden: true });

  const updateTheme = (value: themeEnum): void => {
    setTheme(() => value);
  };

  const updateModal = (values?: Partial<ModalProps>): void => {
    clearModal();
    setModalContent((currentContent) => ({ ...currentContent, ...values }));
  };

  const clearModal = (): void => {
    setModalContent({ hidden: true, content: undefined, buttons: undefined, title: undefined, onConfirm: undefined, onCancel: undefined });
  };

  const toggleLoading = (state?: boolean) => {
    setLoading(state || false);
  };

  return (
    <GlobalContext.Provider value={{ modal: modalContent, updateModal, theme, updateTheme, toggleLoading, loading, clearModal }}>
      {children}
    </GlobalContext.Provider>
  )
};

export default GlobalContextProvider;
