import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
    BrowserRouter as Router,
    Route, Routes
  } from "react-router-dom";
import pages from './components';
import store from './redux/store';
import Page from "./components/common/Page";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.scss';

const routes = [
    {
      path: "/",
      component: pages.home
    },
    {
      path: "/households",
      component: pages.household,
    //   subroutes: [
    //     {
    //       path: "/households/index",
    //       component: household list
    //     },
    //     {
    //       path: "/households/:id",
    //       component: household form and household details
    //     }
    //   ]
    }
  ];

  
const App = () => {
    return (
        <Provider store={store}>
            <Page isLoading={false}> 
            <BrowserRouter>
            
              <Routes>
                    {routes.map((r) => (
                        <Route 
                            path={r.path} 
                            element={<r.component routes={r.subroutes} />} 
                          /> 
                    ))}
                </Routes>
            </BrowserRouter>
            </Page>
        </Provider>
    );
}

export default App;
