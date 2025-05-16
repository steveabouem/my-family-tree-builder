import React from "react";
import { Trans } from "@lingui/macro";
import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import Page from "components/common/Page";
import PageUrlsEnum from "utils/urls";

const FamilyTreeDashboard = () => {
  const theme = useTheme();

  return (
    <Page title={<Trans>tree_dashboard_title</Trans>} subtitle={<Trans>tree_dashboard_subtitle</Trans>}>
      <Box>
        <Typography variant="body1"><Trans>tree_dashboard_lists_title</Trans></Typography>
        <Link to={PageUrlsEnum.newTree} style={{color: theme.palette.secondary.dark, textDecoration: 'none'}}><Trans>create_new_tree</Trans></Link>
      </Box>
      <Box>
        <Trans>tree_dashboard_lists_title</Trans>
      </Box>
    </Page>
  );
};

export default FamilyTreeDashboard;