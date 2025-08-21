import React from "react";
import { Trans } from "@lingui/macro";
import { Box, Button, Typography, useTheme, Divider, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Page from "components/common/Page";
import PageUrlsEnum from "utils/urls";
import { useGetAllForUser } from "services/v2";
import { useZDispatch, useZSelector } from "app/hooks";
import { DUserState } from "app/slices/definitions";
import { FamilyTree } from "services/api.definitions";
import dayjs from "dayjs";
import { EyeIcon } from "utils/assets/icons";
import { populateTreeAction, saveTreeIdAction } from "app/slices/trees";

const FamilyTreeDashboard = () => {
  const { currentUser } = useZSelector<DUserState>(state => state.user);
  const { data, isFetching, isLoading } = useGetAllForUser(currentUser?.userId);
  const dispatch = useZDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const selectTree = (t: FamilyTree) => {
    dispatch(populateTreeAction(t));
    dispatch(saveTreeIdAction(t?.id || 0));

    navigate(PageUrlsEnum.newTree);
  };

  return (
    <Page title={<Trans>tree_dashboard_title</Trans>} subtitle={<Trans>tree_dashboard_subtitle</Trans>} loading={isFetching || isLoading}>
      <Box>
        <Typography variant="body1"><Trans>tree_dashboard_lists_title</Trans></Typography>
        <Link to={PageUrlsEnum.newTree} style={{ color: theme.palette.secondary.dark, textDecoration: 'none' }}><Trans>create_new_tree</Trans></Link>
      </Box>
      <Box>
        <Trans>tree_dashboard_lists_title</Trans>
        <Box display="flex" justifyContent="start" flexWrap="wrap" alignContent="space-between">
          {data?.payload?.map((t: FamilyTree, index: number) => (
            <Paper sx={{margin: '1rem'}} key={t.id || index}>
              <Box key={t.id} display="flex" flexDirection="column" gap={2}>
                <Box display="flex" gap={2} alignItems="center">
                  <Typography><Trans>name</Trans>: {t?.name || ''}</Typography>
                </Box>
                <Divider variant="fullWidth" />
                <Box display="flex" gap={2} alignItems="center">
                  <Typography><Trans>number_of_kin</Trans>: {t?.members?.length || ''}</Typography>
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                  <Typography><Trans>date_created</Trans>: {dayjs(t.created_at).format('YYYY, MMM, dd, HH:mm:ss')}</Typography>
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                  <Typography>
                    <Trans>status</Trans>: {t.active ? <Trans>active</Trans> : <Trans>inactive</Trans>}
                  </Typography>
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                  <Button color="warning" variant="outlined" onClick={() => {selectTree(t)}}><Trans>edit</Trans><EyeIcon /></Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Page>
  );
};

export default FamilyTreeDashboard;