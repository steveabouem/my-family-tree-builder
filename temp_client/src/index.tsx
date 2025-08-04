import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import baseEn from "locales/en/main.js";
import baseFr from "locales/fr/main.js";
import GlobalContextProvider from './contexts/providers/global/GlobalContextProvider';
import FamilyTreeContextProvider from './contexts/providers/familyTree/FamilyTreeContextProvider';
import { store } from 'app/store';
import AppContainer from 'components/common/AppContainer';
import ThemeGenerator from 'components/common/ThemeGenerator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

i18n.load({
  en: baseEn.messages,
  fr: baseFr.messages,
});
i18n.activate("fr", "en");
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ThemeGenerator>
        <GlobalContextProvider>
          <FamilyTreeContextProvider>
            <I18nProvider i18n={i18n}>
              <BrowserRouter>
                <Routes>
                  <Route path="/*" element={<AppContainer />} />
                </Routes>
              </BrowserRouter>
            </I18nProvider>
          </FamilyTreeContextProvider>
        </GlobalContextProvider>
      </ThemeGenerator>
    </Provider>
  </QueryClientProvider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
