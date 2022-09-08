import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Page from "./components/common/Page";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.scss';

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
