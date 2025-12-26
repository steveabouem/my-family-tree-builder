import React, { useContext } from "react";
import { Trans } from "@lingui/macro";
import { Box, Typography, useTheme, Divider, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Page from "components/common/Page";
import PageUrlsEnum from "utils/urls";
import { useDeleteTree, useGetAllForUser } from "services/v2";
import { useZDispatch, useZSelector } from "app/hooks";
import { UserState, FamilyTreeRecord } from "types";
import dayjs from "dayjs";
import { populateTreeAction, saveTreeIdAction } from "app/slices/trees";
import { DeleteIcon, EyeIcon } from "utils/assets/icons";
import GlobalContext from "contexts/creators/global";

const FamilyTreeDashboard = () => {
  const {updateModal, clearModal} = useContext(GlobalContext);
  const { currentUser } = useZSelector<UserState>(state => state.user);
  const { data, isFetching, isLoading } = useGetAllForUser(currentUser?.userId);
  const { mutate: deleteTreeMutation } = useDeleteTree();
  const dispatch = useZDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  function selectTree (t: FamilyTreeRecord) {
    dispatch(populateTreeAction(t));
    dispatch(saveTreeIdAction(t?.id || 0));

    navigate(PageUrlsEnum.viewTree.replace(':id', `${t?.id}`));
  };

   function showDeleteTreeWarning(t: FamilyTreeRecord) {
      updateModal({
        hidden: false,
        buttons: {
          cancel: true,
          confirm: true,
        },
        // @ts-ignore
        title: <Trans>delete_tree_warning_title?</Trans>,
        content: <Trans>delete_tree_warning_msg</Trans>,
        onConfirm: () => {
        deleteTreeMutation({ id: t.id, userId: currentUser?.userId || 0 });
          clearModal();
        },
      });
    }

  return (
    <Page title={<Trans>tree_dashboard_title</Trans>} subtitle={<Trans>tree_dashboard_subtitle</Trans>} loading={isFetching || isLoading}>
      <Box>
        <Typography variant="body1"><Trans>tree_dashboard_lists_title</Trans></Typography>
        <Link to={PageUrlsEnum.newTree} style={{ color: theme.palette.secondary.dark, textDecoration: 'none' }}><Trans>create_new_tree</Trans></Link>
      </Box>
      <Box>
        <Trans>tree_dashboard_lists_title</Trans>
        <Box sx={treeDashboardContainerStyles}>
          {data?.payload?.map((t: FamilyTreeRecord, index: number) => (
            <Paper sx={treeHolderStyle} key={t.id || index}>
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
                <Box display="flex" gap={2} alignItems="center" justifyContent="end">
                  <EyeIcon sx={{ cursor: 'pointer' }} onClick={() => selectTree(t)} />
                  <DeleteIcon sx={{ cursor: 'pointer' }} onClick={() => { showDeleteTreeWarning(t)}} />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Page>
  );
};

const treeDashboardContainerStyles = {
  display: "flex",
  justifyContent: "start",
  flexWrap: "wrap",
  alignContent: "space-between"
};

const treeHolderStyle = {
  margin: '1rem',
  background: ' rgba(243, 245, 247, 0.21)',
  boxShadow: ' 0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: ' blur(12.9px)',
  WebkitBackdropFilter: ' blur(12.9px)',
};

export default FamilyTreeDashboard;