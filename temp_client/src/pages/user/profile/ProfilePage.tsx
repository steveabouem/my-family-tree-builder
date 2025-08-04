import { Trans } from "@lingui/macro";
import React, { useCallback, useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper, Button, useTheme } from "@mui/material";
import { MdOutlineAddBox } from "react-icons/md";
import img1 from "utils/assets/images/kids under tree locked.jpg"
import GlobalContext from "contexts/creators/global/global.context";
import { DChangePasswordValues } from "../definitions";
import UserCredentials from "./UserCredentials";
import PageUrlsEnum from "utils/urls";
import Page from "components/common/Page";
import NotFound from "pages/404NotFound";
import { DFamilyTreeState, DUserState } from "app/slices/definitions";
import { EyeIcon, GroupIcon } from "utils/assets/icons";
import { saveTreesListAction } from "app/slices/trees";
import { submitPasswordChangeForm } from "services/auth";
import { getAllForUser } from "services/familyTree";
import { useZDispatch, useZSelector } from "app/hooks";


const UserProfilePage = (): JSX.Element => {
  const dispatch = useZDispatch();
  const { list } = useZSelector<DFamilyTreeState>(state => state.tree);
  const { currentUser } = useZSelector<DUserState>(state => state.user);
  const { toggleLoading, updateModal } = useContext(GlobalContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const getfamilyTrees = useCallback(async (): Promise<any> => {
    const userId = currentUser?.id;

    if (userId && userId === Number(id)) {
      const families = await getAllForUser(userId)
        .catch((e: unknown) => {
          console.log('Get FAMILIES: ', e);
        });

      return families;
    } else {
      navigate(PageUrlsEnum.auth);
    }
  }, [currentUser, id]);

  useEffect(() => {
    if (currentUser?.id) {
      getfamilyTrees()
        .then(({ data }) => {
          if (!data.error) {
            dispatch(saveTreesListAction(data))
            toggleLoading(false);
          }
        })
        .catch((e: unknown) => {
          updateModal({
            hidden: false,
            buttons: { confirm: true, cancel: false },
            content: <Trans>error_modal_message</Trans>,
            title: <Trans>error_modal_title</Trans>,
          });
          toggleLoading(false);
        });
    }
  }, [currentUser]);

  function handlePasswordChange(values: DChangePasswordValues) {
    toggleLoading(true);
    submitPasswordChangeForm(values)
      .then((updatedUser) => {
        toggleLoading(false);
        updateModal({
          hidden: false,
          buttons: { confirm: true, cancel: false },
          content: <Trans>operation_success_text</Trans>,
          title: <Trans>operation_success_title</Trans>,
        });
      })
      .catch((e: unknown) => {
        console.log('ERRR login out: ', e);
        toggleLoading(false);

        // ! -TOFIX: handle error
        updateModal({
          hidden: false,
          buttons: { confirm: true, cancel: false },
          content: <Trans>operation_failure_text</Trans>,
          title: <Trans>operation_failure_title</Trans>,
        });
      });
  }

  return currentUser ? (
    <Page subtitle={<Trans>profile_page_subtitle</Trans>} title={<Trans>profile_page_title {currentUser?.first_name || ''}</Trans>} bg={img1}>
      <Box display="flex" justifyContent="space-between">
        <UserCredentials handleSubmit={handlePasswordChange} />
        <Paper style={{ display: 'flex', flexDirection: 'column', flex: '0 1 47%', padding: '1rem .5rem' }}>
          <Typography variant="h4"><Trans>tree_management_label</Trans></Typography>
          {
            list?.length ? (
              <>
                <Typography variant="subtitle2">
                  <><Trans>your_trees_title</Trans> ({list?.length || 0})</>
                </Typography>
                {
                  list?.map((tree: any, index: number) => (
                    <Box display="flex" justifyContent="start" gap={2} key={`tree-preview-${index}`}>
                      <Box flex={1}>
                        {tree?.name}
                      </Box>
                      <Box>
                        <GroupIcon /> {JSON.parse(tree?.members || '[]').length}
                      </Box>
                      <Box>
                        <Link to={`${PageUrlsEnum.viewTree.replace(':id', tree?.id || '')}`} style={{ color: theme.palette.secondary.dark, textDecoration: 'none' }}><EyeIcon /></Link>
                      </Box>
                    </Box>
                  ))
                }
              </>
            )
              : (
                <Box display="flex" justifyContent="flex-end" width="100%" alignItems="center">
                  <Button variant="outlined" color="secondary" sx={{ display: 'flex', gap: "1rem" }}>
                    <MdOutlineAddBox size={20} />
                    <Link style={{ textDecoration: "none" }} to={PageUrlsEnum.trees}>
                      <Typography variant="body2"><Trans>create_your_first_tree</Trans></Typography></Link>
                  </Button>
                </Box>
              )
          }
        </Paper>
      </Box>
    </Page>
  ) : (
    <NotFound title={<Trans>profile_not_found</Trans>} /> // this probably wont be necesarry given redirect
  );
}

export default UserProfilePage;