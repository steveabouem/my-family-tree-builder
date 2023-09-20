import FTAuthentication from "./FT/auth/Authentication";
import FTLandingPage from "./FT/FT.Landing";
import "../components/common/"

const pages = {
  tree: {
    landing: FTLandingPage,
    login: FTAuthentication
  }
};


export default pages;