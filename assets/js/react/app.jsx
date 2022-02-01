import React from 'react';
import ReactDOM from 'react-dom';
import './src/styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../bootstrap";
import {Page} from "./src/components/common/Page";
import {LandingPage} from "./src/components/LandingPage";
import Household from "./src/containers/household";

const rootContainer = document.getElementById('root');
const householdElement = document.getElementById('household');

class App extends React.Component {
    render() {
        return (
           <Page>
               <LandingPage />
           </Page>
        );
    }
}

ReactDOM.render(<App />, rootContainer)
