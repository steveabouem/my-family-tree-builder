import FTAuthentication from "./FT/auth/Authentication";
import FTLandingPage from "./FT/FT.Landing";
import "../components/common/"
// import HouseholdLanding from "./household/household.landing";
// import HouseholdManager from "./household/household.manager";
// import { LandingPage as home } from "./LandingPage";

const pages = {
  tree: {
    landing: FTLandingPage,
    login: FTAuthentication
  }
};


export default pages;