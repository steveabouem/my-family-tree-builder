import FTAuthentication from "./FT/Authentication";
import FTLanding from "./FT/FT.Landing";
// import HouseholdLanding from "./household/household.landing";
// import HouseholdManager from "./household/household.manager";
// import { LandingPage as home } from "./LandingPage";

const pages = {
    tree: {
        landing: FTLanding,
        login: FTAuthentication
    }
};


export default pages;