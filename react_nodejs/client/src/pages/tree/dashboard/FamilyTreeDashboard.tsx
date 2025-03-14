import React from "react";
import { Trans } from "@lingui/macro";
import { Box, Link, Typography } from "@mui/material";
import Page from "components/common/Page";
import PageUrlsEnum from "utils/urls";

const FamilyTreeDashboard = () => {
  return (
    <Page title={<Trans>tree_dashboard_title</Trans>} subtitle={<Trans>tree_dashboard_subtitle</Trans>}>
      <Box>
        <Typography variant="body1"><Trans>tree_dashboard_lists_title</Trans></Typography>
        <Link href={PageUrlsEnum.newTree}><Trans>create_new_tree</Trans></Link>
      </Box>
      <Box>
        <Trans>tree_dashboard_lists_title</Trans>
      </Box>
    </Page>
  );
};

export default FamilyTreeDashboard;