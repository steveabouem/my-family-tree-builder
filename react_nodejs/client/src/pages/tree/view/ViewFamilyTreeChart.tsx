import React from "react";
import { Trans } from "@lingui/macro";
import { Box, Grid2 } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Page from "components/common/Page";
import { service } from "services/index";
import FamilyTreeContext from "contexts/creators/familyTree";
import GlobalContext from "contexts/creators/global";
import TreeNodeBubble from "pages/family/TreeNodeBubble";
import PageUrlsEnum from "utils/urls";
import('../tree.scss');

const ViewFamilyTreeChartPage = () => {
  const [rootId, setRootId] = React.useState<any>();
  const { currentFamilyTree, updateCurrentFamilyTree } = React.useContext(FamilyTreeContext);
  const { toggleLoading, updateModal, loading } = React.useContext(GlobalContext);
  const [treeData, setTreeData] = React.useState<any>();
  const { id } = useParams();
  const navigate = useNavigate();

  const getCurrentTree = async (): Promise<any> => {
    const familyTreeService = new service.familyTree();

    if (id) {
      const tree = await familyTreeService.getOne(id)
        .catch(e => {
          console.log('Get FAMILY: ', e);
        });

      return tree;
    } else {
      navigate(PageUrlsEnum.auth);
    }
  };


  React.useEffect(() => {
    const parsedTree = currentFamilyTree.members;
    getCurrentTree()
      .then(({ data }) => {
        if (!data.error) {
          if (updateCurrentFamilyTree) updateCurrentFamilyTree(data.payload);
        }
      })
      .catch(e => {
        updateModal({
          hidden: false,
          buttons: { confirm: true, cancel: false },
          content: <Trans>error_modal_message</Trans>,
          title: <Trans>error_modal_title</Trans>,
        });
      });
  }, []);

  React.useEffect(() => {
    if (currentFamilyTree?.members) {
      // @ts-ignore
      const parsedMembers = JSON.parse(currentFamilyTree.members);
      setRootId(parsedMembers[0].id);
      setTreeData(parsedMembers);
    }
  }, [currentFamilyTree]);

  React.useEffect(() => {
    if (treeData?.length && rootId) {
      // @ts-ignore
      toggleLoading(false);
    }
  }, [treeData, rootId])

  if (loading) {
    return <Box>Loading</Box>;
  } else {
    return (
      <Page subtitle="" title={`${currentFamilyTree?.name || ''}`}>
        <Grid2 container>
          <Grid2 size={2}></Grid2>
          <Grid2 size={8}></Grid2>
          <Grid2 size={2}></Grid2>
        </Grid2>
      </Page >
    );
  }
}

export default ViewFamilyTreeChartPage;

