import React, { ReactNode, useMemo } from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from 'utils/material';
import { useZSelector } from 'app/hooks';
import { DThemeState } from 'app/slices/definitions';

const ThemeGenerator = ({children}: {children: ReactNode}) => {
  const { season } = useZSelector<DThemeState>(state => state.theme);
  
  const currentTheme = useMemo(() => theme(season), [season]);

  return (
    <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
  )
}

export default ThemeGenerator