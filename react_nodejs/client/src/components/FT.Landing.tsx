import React, { useContext } from "react";
import GlobalContext from "../context/creators/global.context";
import Page from "../pages/common/Page";

const FTLandingPage = (): JSX.Element => {
  const {theme} = React.useContext(GlobalContext);
  return (
    <Page
      title="Welcome to your Family Tree"
      subtitle="HEad to the authentication page for now"
    />
  );
}

export default FTLandingPage;