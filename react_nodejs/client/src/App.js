import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
    Route, Routes
  } from "react-router-dom";
import pages from './components';
import store from './redux/store';
import Page from "./components/common/Page";
import './styles/index.scss';
import NotFound from './components/common/404NotFound';

const routes = [
    {
      path: "/",
      component: pages.home
    },
    {
      path: "/households",
      component: pages.household,
      subroutes: [
        {
          path: "/households/manage",
          component: pages.household.create
        }
      ]
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
                    <Route
                      path="*"
                      element={<NotFound />}
                    />
                </Routes>
            </BrowserRouter>
            </Page>
        </Provider>
    );
}

export default App;
