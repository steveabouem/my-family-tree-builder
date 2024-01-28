import React from 'react';
import ReactDOM from 'react-dom/client';
import AppContainer from './components/common/AppContainer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import * as baseEN from "./locales/en/main.js";
import * as baseFR from "./locales/fr/main.js";
import GlobalContextProvider from './context/providers/GlobalContextProvider';
import FamilyTreeContextProvider from './context/providers/FamilyContextProvider';

i18n.load({
  en: baseEN,
  fr: baseFR,
});
i18n.activate("fr");

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
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
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
