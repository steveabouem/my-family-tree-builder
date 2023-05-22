import React from 'react';
import {
  BrowserRouter,
    Route, Routes
  } from "react-router-dom";
import FTLanding from './components/FT/FT.Landing';
import FTAuthentication from './components/FT/Authentication';

const App = (): JSX.Element => {
    return (
      <BrowserRouter>
        <Routes>
          {/* TODO: no any */}
            <Route
              path="/ft"
              element={<FTLanding />}
            />
            <Route
              path="/ft/register"
              element={<FTAuthentication />}
            />
            <Route
              path="*"
              element={<div>NOT FOUND</div>}
            />
          </Routes>
      </BrowserRouter>
    );
}

export default App;
