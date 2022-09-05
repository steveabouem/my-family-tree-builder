import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Page from "./src/components/common/Page";
import "../../bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './src/styles/index.scss';

const App = ({children}) => {
    return (
        <Provider store={store}>
            <Page>
                {children}
            </Page>
        </Provider>
    );
}

export default App;
