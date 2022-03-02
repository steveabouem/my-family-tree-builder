import React from 'react';
import ReactDOM from 'react-dom';
import App from "../../app";
import HouseholdLanding from "../components/household/household.landing";

const householdElement = document.getElementById('root');

const Household = () => {

    return (
        <App>
           <HouseholdLanding />
        </App>
    );
}

ReactDOM.render(<Household />, householdElement)
