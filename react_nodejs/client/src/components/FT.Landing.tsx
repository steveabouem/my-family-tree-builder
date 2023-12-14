import React, { useContext } from "react";
import Page from "./common/Page";
import GlobalContext from "../context/global.context";

const FTLandingPage = (): JSX.Element => {
  const {theme} = useContext(GlobalContext);
  return (
    <div>
      <h2>Welcome to  your Tree Manager</h2>
      <h3>Use nav bar for now</h3>
    </div> 
  );
}

export default FTLandingPage;