import React, { useContext, useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import { Box, Typography, useTheme, Divider, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import styled from 'styled-components';
import { populateTreeAction, resetAction, saveTreeIdAction } from "app/slices/trees";
import { AddIcon, DeleteIcon, EyeIcon } from "utils/assets/icons";
import GlobalContext from "contexts/creators/global";
import Page from "components/common/Page";
import PageUrlsEnum from "utils/urls";
import { useDeleteAllTree, useDeleteTree, useGetAllForUser } from "api";
import { useZDispatch } from "app/hooks";
import { FamilyTreeRecord } from "types";
import EmptyList from "components/common/EmptyList";
import BoxRow from "components/common/containers/column";

const FamilyTreeDashboard = () => {
  const [selectedTree, setSelectedTree] = useState<number>(0);
  const { updateModal, clearModal } = useContext(GlobalContext);
  const { data, isFetching, isLoading, refetch: refreshTreesList, error: getTreesError } = useGetAllForUser();
  const { mutate: deleteTreeMutation, isSuccess: deletionSuccessful, isError: deletionFailed } = useDeleteTree(selectedTree);
  const { mutate: deleteAllMutation, isSuccess: deleteAllSuccessful, isError: deleteAllFailed } = useDeleteAllTree();
  const dispatch = useZDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const hasTrees = !!data?.payload?.length;

  useEffect(() => {
    if (deletionSuccessful) {
      refreshTreesList();
      showDeleteTreeSuccess();
    }

    if (deletionFailed) {
      showDeleteTreerror();
    }
  }, [deletionSuccessful, deletionFailed]);
  useEffect(() => {
    if (deleteAllSuccessful) {
      refreshTreesList();
      showDeleteAllSuccess();
    }

    if (deleteAllFailed) {
      showDeleteAllrror();
    }
  }, [deleteAllSuccessful, deletionFailed]);

  function selectTree(t: FamilyTreeRecord) {
    dispatch(populateTreeAction(t));
    dispatch(saveTreeIdAction(t?.id || 0));

    navigate(PageUrlsEnum.viewTree.replace(':id', `${t?.id}`));
  };

  function showDeleteTreeWarning(t: FamilyTreeRecord) {
    setSelectedTree(t.id);
    updateModal({
      hidden: false,
      buttons: {
        cancel: true,
        confirm: true,
      },
      type: 'warning',
      title: <Trans>delete_tree_warning_title?</Trans>,
      content: <Trans>delete_tree_warning_msg</Trans>,
      onConfirm: () => {
        deleteTreeMutation();
        clearModal();
      },
    });
  }

  function showDeleteTreeSuccess() {
    updateModal({
      hidden: false,
      buttons: {
        cancel: false,
        confirm: true,
        confirmText: <Trans>ok</Trans>
      },
      type: 'success',
      title: <Trans>delete_tree_success_title?</Trans>,
      content: <Trans>delete_tree_success_msg</Trans>,
      onConfirm: () => {
        clearModal();
      },
    });
  }

  function showDeleteTreerror() {
    updateModal({
      hidden: false,
      buttons: {
        cancel: false,
        confirm: true,
        confirmText: <Trans>ok</Trans>
      },
      type: 'error',
      title: <Trans>delete_tree_error_title?</Trans>,
      content: <Trans>delete_tree_error_msg</Trans>,
      onConfirm: () => {
        clearModal();
      },
    });
  }

  function showDeleteAllWarning() {
    updateModal({
      hidden: false,
      buttons: {
        cancel: true,
        confirm: true,
      },
      type: 'warning',
      title: <Trans>delete_tree_warning_title?</Trans>,
      content: <Trans>delete_tree_warning_msg</Trans>,
      onConfirm: () => {
        deleteAllMutation();
      },
    });
  }

  function showDeleteAllSuccess() {
    updateModal({
      hidden: false,
      buttons: {
        cancel: false,
        confirm: true,
        confirmText: <Trans>ok</Trans>
      },
      type: 'success',
      title: <Trans>delete_tree_success_title?</Trans>,
      content: <Trans>delete_tree_success_msg</Trans>,
      onConfirm: () => {
        clearModal();
      },
    });
  }

  function showDeleteAllrror() {
    updateModal({
      hidden: false,
      buttons: {
        cancel: false,
        confirm: true,
        confirmText: <Trans>ok</Trans>
      },
      type: 'error',
      title: <Trans>delete_tree_error_title?</Trans>,
      content: <Trans>delete_tree_error_msg</Trans>,
      onConfirm: () => {
        clearModal();
      },
    });
  }

  return (
    <Page
      error={!!getTreesError} code={data?.code} reload={refreshTreesList}
      title={<Trans>tree_dashboard_title</Trans>}
      subtitle={<Trans>tree_dashboard_lists_title</Trans>}
      loading={isFetching || isLoading}
    >
      {hasTrees ? (
        <>
          <BoxRow sx={{ justifyContent: 'end' }}>
            <Button variant="outlined" color="success" onClick={() => {
                navigate(PageUrlsEnum.newTree);
              }}
              sx={{ justifyContent: 'start', display: 'flex', gap: '1rem' }}
            >
              <Trans>add</Trans>
              <AddIcon size={15} color={theme.palette.success.dark} tooltip={<Trans>add new family tree</Trans>} />
            </Button>
            <Button variant="outlined" color="error" onClick={() => { showDeleteAllWarning() }}
              sx={{ justifyContent: 'start', display: 'flex', gap: '1rem' }}
            >
              <Trans>delete_all</Trans>
              <DeleteIcon size={15} color={theme.palette.error.dark} tooltip={<Trans>delete_all_trees</Trans>} />
            </Button>
          </BoxRow>
          <TreeDashboardContainer sx={{ border: 'none' }}>
            {data?.payload?.map((t: FamilyTreeRecord, index: number) => (
              <TreeCard key={t.id || index}>
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
                    <EyeIcon link sx={{ cursor: 'pointer' }} onClick={() => selectTree(t)} tooltip={<Trans>view_tree</Trans>} />
                    <DeleteIcon link sx={{ cursor: 'pointer' }} onClick={() => { showDeleteTreeWarning(t) }} tooltip={<Trans>delete_tree</Trans>} />
                  </Box>
                </Box>
              </TreeCard>

            ))}
          </TreeDashboardContainer>
        </>
      ) : <EmptyList
        handleRefresh={refreshTreesList}
        handleAdd={() => {
          dispatch(resetAction());
          navigate(PageUrlsEnum.newTree);
        }} />}
    </Page>
  );
};

const TreeDashboardContainer = styled(Box)`
  position: relative;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  height: 100%;
  width: 100%;
`;

const TreeCard = styled(Paper)`
  margin: 1rem;
  background:  rgba(243, 245, 247, 0.21);
  box-shadow:  0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter:  blur(12.9px);
`;

export default FamilyTreeDashboard;