import React, { useContext, useEffect } from "react";
import { Box, Grid2 } from "@mui/material";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import Page from "components/common/Page";
import { useZDispatch, useZSelector } from "app/hooks";
import { populateTreeAction, resetAction } from "app/slices/trees";
import { FamilyTreeState } from "types";
import { formatTreeMembers } from "../create/genealogy/utils";
import GenealogyTree from 'pages/tree/layout/GenealogyTree';
import PageUrlsEnum from "utils/urls";
import { useGetTreeById } from "api/familyTree";
import PaperSection from "components/common/containers/PaperSection";
import GlobalContext from "contexts/creators/global";
import { Trans } from "@lingui/macro";
import BoxColumn from "components/common/containers/row/BoxColumn";

const ViewFamilyTreePage = () => {
  const { loading, toggleLoading } = useContext(GlobalContext);
  const { id } = useParams();
  const { data, isLoading: isUserTreeLoading, isSuccess } = useGetTreeById(id || '', !!id);
  const dispatch = useZDispatch();
  const { list, currentFamilyTree } = useZSelector<FamilyTreeState>(state => state.tree);
  const { data: treeData, isLoading, error } = useGetTreeById(id || '', true);

  useEffect(() => {
    console.log({ data, isUserTreeLoading, id });
    if (isSuccess && data.payload.members) {
      dispatch(populateTreeAction(data.payload));
    }

  }, [data, isSuccess, isUserTreeLoading]);

  useEffect(() => {
    toggleLoading(false); // TODO: global context;s loading seems redundant
    dispatch(resetAction(undefined))
  }, []);

  useEffect(() => {
    if (treeData?.payload?.members) {
      const currTree = formatTreeMembers(JSON.parse(treeData.payload.members));
      dispatch(populateTreeAction(currTree));
    }
  }, [treeData, dispatch]);


  if (error) {
    // return <div>Error loading tree: {error.message}</div>;
  }

  return (
    <Page subtitle="" title={`${currentFamilyTree?.name || ''}`} prevUrl={PageUrlsEnum.trees} loading={isLoading}>
      <Box sx={mainContainerStyle}>
        <PaperSection>
          <BoxColumn>
            <Trans>view_tree_page_title</Trans>
            <Formik initialValues={{}} onSubmit={() => { }}>
              {(props) => currentFamilyTree ? <GenealogyTree /> : null}
            </Formik>
          </BoxColumn>
        </PaperSection>
      </Box>
    </Page>
  );
}

const mainContainerStyle = {
  height: '80vh',
  width: '100%',
  position: 'absolute',
};

export default ViewFamilyTreePage;

