import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../../bootstrap";
import {Page} from "../components/common/Page.jsx";

const householdElement = document.getElementById('household');

class Household extends React.Component {
    render() {
        return (
            <Page>
                HOUSEHOLD
            </Page>
        );
    }
}

console.log('parkour', {householdElement})
if (householdElement) {
    ReactDOM.render(<Household />, householdElement)
}
