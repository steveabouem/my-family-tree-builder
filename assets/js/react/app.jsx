import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch} from "react-router";
import './src/styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../bootstrap";
import {Page} from "./src/components/common/Page";
import {LandingPage} from "./src/components/LandingPage";

const rootContainer = document.getElementById('root');

class App extends React.Component {
    render() {
        return (
           <Page>

           </Page>
        );
    }
}

ReactDOM.render(<App />, rootContainer)
