import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route, Routes
} from "react-router-dom";
import FTLandingPage from './components/FT/FT.Landing';
import NotFound from './components/common/404NotFound';
import GlobalContext, { applicationEnum } from './context/global.context';

const App = (): JSX.Element => {

  return (
    // <GlobalContext.Provider value={currentApp}>
      <div id={applicationEnum.TR}>
        TRACKER from app
      </div>
    // </GlobalContext.Provider>
  );
}

export default App;
