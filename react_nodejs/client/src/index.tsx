import React from 'react';
import ReactDOM from 'react-dom/client';
import FTAppContainer from './components/common/FT.AppContainer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<FTAppContainer />} />
    </Routes>
  </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
