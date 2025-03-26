import { Trans } from "@lingui/macro";
import React, { useCallback, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Link, Typography, Paper, Button } from "@mui/material";
import img1 from "utils/assets/images/kids under tree locked.jpg"
import GlobalContext from "contexts/creators/global/global.context";
import FamilyTreeContext from "contexts/creators/familyTree/familyTree.context";
import { DChangePasswordValues } from "../definitions";
import UserCredentials from "./UserCredentials";
import { MdOutlineAddBox } from "react-icons/md";
import PageUrlsEnum from "utils/urls";
import { service } from "services/index";
import Page from "components/common/Page";
import NotFound from "pages/404NotFound";

const UserProfilePage = (): JSX.Element => {
  const { currentUser, familyTrees, updateFamilyTrees } = useContext(FamilyTreeContext);
  const { toggleLoading, updateModal } = useContext(GlobalContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const getfamilyTrees = useCallback(async (): Promise<any> => {
    const familyTreeService = new service.familyTree();
    const userId = currentUser?.userId;

    if (userId && userId === Number(id)) {
      const families = await familyTreeService.getAllForUser(userId)
        .catch(e => {
          console.log('Get FAMILIES: ', e);
        });

      return families;
    } else {
      navigate(PageUrlsEnum.auth);
    }
  }, [currentUser, id]);

  useEffect(() => {
    if (currentUser?.userId) {
      getfamilyTrees()
        .then(({ data }) => {
          if (!data.error) {
            if (updateFamilyTrees) updateFamilyTrees(data.payload);
            if (toggleLoading) toggleLoading(false);
          }
        })
        .catch((e: unknown) => {
          if (updateModal) updateModal({
            hidden: false,
            buttons: { confirm: true, cancel: false },
            content: <Trans>error_modal_message</Trans>,
            title: <Trans>error_modal_title</Trans>,
          });
          if (toggleLoading) toggleLoading(false);
        });
    }
  }, [currentUser]);

  function handlePasswordChange(values: DChangePasswordValues) {
    toggleLoading(true);
    const authService = new service.auth('auth');
    authService.submitPasswordChangeForm(values)
      .then((updatedUser) => {
        toggleLoading(false);
        if (updateModal) updateModal({
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
        if (updateModal) updateModal({
          hidden: false,
          buttons: { confirm: true, cancel: false },
          content: <Trans>operation_failure_text</Trans>,
          title: <Trans>operation_failure_title</Trans>,
        });
      });
  }

  return currentUser ? (
    <Page subtitle={<Trans>profile_page_subtitle</Trans>} title={<Trans>profile_page_title {currentUser?.firstName || ''}</Trans>} bg={img1}>
      <Box display="flex" justifyContent="space-between">
        <UserCredentials handleSubmit={handlePasswordChange} />
        <Paper style={{ display: 'flex', flexDirection: 'column', flex: '0 1 47%', padding: '1rem .5rem' }}>
          <Typography variant="h4"><Trans>tree_management_label</Trans></Typography>
          {
            familyTrees?.length ?
              <Typography variant="subtitle2">
                <><Trans>your_tree_title</Trans> ({familyTrees?.length || 0})</>
              </Typography>
              : (
                <Box display="flex" justifyContent="flex-end" width="100%" alignItems="center">
                  <Button variant="outlined" color="secondary" sx={{ display: 'flex', gap: "1rem" }}>
                    <MdOutlineAddBox size={20} />
                    <Link underline="none" href={PageUrlsEnum.trees}><Trans>create_your_first_tree</Trans></Link>
                  </Button>
                </Box>
              )
          }
        </Paper>
      </Box>
      {
        familyTrees?.map((tree: any, index: number) => (
          <Box display="flex" gap={2} key={`tree-preview-${index}`}>
            <Box flex="0 1 30%">
              {tree?.name}
            </Box>
            <Box flex="0 1 30%">
              <Link href={`/family-trees/${tree?.id || ''}`}><Trans>go_check_my_tree</Trans></Link>
            </Box>
          </Box>
        ))
      }
    </Page>
  ) : (
    <NotFound title={<Trans>profile_not_found</Trans>} /> // this probably wont be necesarry given redirect
  );
}

export default UserProfilePage;