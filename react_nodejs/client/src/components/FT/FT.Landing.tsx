import React, { useEffect } from "react"
import FTAppContainer from "./common/FT.AppContainer";
import { applicationEnum } from "../../context/global.context";

const FTLandingPage = (): JSX.Element => {
  useEffect(() => {
    console.log('READY');

  }, []);

  return  (
    <FTAppContainer app={applicationEnum.FT}>
     <h1>FT Landing</h1>
     
    </FTAppContainer>
  );
}

export default FTLandingPage;