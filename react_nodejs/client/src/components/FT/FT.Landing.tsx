import React, { useEffect } from "react"
import FTAppContainer from "./common/FT.AppContainer";
import { applicationEnum } from "../../context/global.context";
import { FTLinkEnums } from "../common/definitions";
import { Link } from "react-router-dom";

const FTLandingPage = (): JSX.Element => {
  useEffect(() => {
    console.log('READY');

  }, []);

  return  (
    <FTAppContainer app={applicationEnum.FT}>
     <h1>FT Landing</h1>
     <div>You are currently not connected
      <span>HAve a profile? <Link to={FTLinkEnums.login}>Login</Link></span>
      <span>New User? <Link to={FTLinkEnums.register}>Register</Link></span>
     </div>
    </FTAppContainer>
  );
}

export default FTLandingPage;