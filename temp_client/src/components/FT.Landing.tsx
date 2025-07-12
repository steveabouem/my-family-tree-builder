import React, { useContext } from "react";
import Page from "./common/Page";
import { Trans } from "@lingui/macro";

const FTLandingPage = (): JSX.Element => {
  return (
    <Page
      title={<Trans>main_welcome_header</Trans>}
      subtitle={<Trans>main_welcome_subheader</Trans>}
    />
  );
}

export default FTLandingPage;