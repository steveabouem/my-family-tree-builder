import { Trans } from "@lingui/macro";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from '../404NotFound';
import Page from "../../components/common/Page";
import { service } from "../../services";
import FamilyTreeContext from "contexts/creators/familyTree/familyTree.context";
import GlobalContext from "contexts/creators/global/global.context";
import { Box, Link, Typography } from "@mui/material";

const UserProfilePage = (): JSX.Element => {
  const { currentUser, familyTrees, updateFamilyTrees } = React.useContext(FamilyTreeContext);
  const { toggleLoading, updateModal } = React.useContext(GlobalContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const getfamilyTrees = React.useCallback(async (): Promise<any> => {
    const familyTreeService = new service.familyTree();
    const userId = currentUser?.userId;

    if (userId && userId === Number(id)) {
      const families = await familyTreeService.getAllForUser(userId)
        .catch(e => {
          console.log('Get FAMILIES: ', e);
        });

      return families;
    } else {
      navigate('/connect');
    }
  }, [currentUser, id]);


  React.useEffect(() => {
    if (currentUser?.userId) {
      getfamilyTrees()
        .then(({ data }) => {
          if (!data.error) {
            if (updateFamilyTrees) updateFamilyTrees(data.payload);
            if (toggleLoading) toggleLoading(false);
          }
        })
        .catch(e => {
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

  return currentUser ? (
    <Page subtitle="My profile" title={`Welcome ${currentUser?.firstName || ''}`}>
      <Box display="flex">
        <Box flex="0 1 50%">
          <Typography variant="subtitle2">
            {
              familyTrees?.length ? <><Trans>your_tree_title</Trans> ({familyTrees?.length || 0}) </>
                : <Trans>manage_your_tree_title</Trans>
            }
          </Typography>
        </Box>
      </Box>
      {
        familyTrees?.map((tree: any, index: number) => (
          <Box  display="flex" gap={2} key={`tree-preview-${index}`}>
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
    <NotFound title="Profile Not Found!" /> // this probably wont be necesarry given redirect
  );
}

export default UserProfilePage;