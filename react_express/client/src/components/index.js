import HouseholdLanding from "./household/household.landing";
import HouseholdManager from "./household/household.manager";
import { LandingPage as home } from "./LandingPage";

const pages = {
    home,
    household: {
        index: HouseholdLanding,
        manage: HouseholdManager
    },
};

export default pages;