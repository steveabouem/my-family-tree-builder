import React, { useContext } from "react";
import Page from "../common/Page";
import GlobalContext from "../../context/global.context";

const FTLandingPage = (): JSX.Element => {
  const {theme} = useContext(GlobalContext);
  return (
    <Page title="Welcome to  your Tree Manager" subTitle="Use nav bar for now" isLoading={false} theme={theme} />
  );
}

export default FTLandingPage;