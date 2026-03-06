import React from "react";
import Page from "../components/common/Page";
import { Trans } from "@lingui/macro";

const LandingPage = (): JSX.Element => {
  return (
    <Page
      title={<Trans>main_welcome_header</Trans>}
      subtitle={<Trans>main_welcome_subheader</Trans>}
    />
  );
};

export default LandingPage;