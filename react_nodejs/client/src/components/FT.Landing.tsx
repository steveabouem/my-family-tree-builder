import React, { useContext } from "react";
import Page from "../pages/common/Page";
import GlobalContext from "contexts/creators/global/global.context";

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