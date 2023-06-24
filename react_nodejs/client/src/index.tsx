import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NotFound from './components/common/404NotFound';
import FTAppContainer from './components/FT/common/FT.AppContainer';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>Tracker!</div>} />
      <Route path="/ft/" element={<FTAppContainer />} />
    </Routes>
      
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
