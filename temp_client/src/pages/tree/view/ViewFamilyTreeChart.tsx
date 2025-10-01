import React, { useEffect } from "react";
import { Box, Grid2 } from "@mui/material";
import {  useParams } from "react-router-dom";
import { Formik } from "formik";
import Page from "components/common/Page";
import { useZDispatch, useZSelector } from "app/hooks";
import { populateTreeAction } from "app/slices/trees";
import { FamilyTreeState } from "types";
import { formatTreeMembers } from "../create/genealogy/utils";
import GenealogyTree from 'pages/tree/layout/GenealogyTree';
import PageUrlsEnum from "utils/urls";
import { useGetTreeById } from "services/v2/familyTreeV2";

const ViewFamilyTreeChartPage = () => {
  const dispatch = useZDispatch();
  const { list, currentFamilyTree } = useZSelector<FamilyTreeState>(state => state.tree);
  const { id } = useParams();

  // React Query hook for getting tree by ID
  const { data: treeData, isLoading, error } = useGetTreeById(id || '', !!id && !currentFamilyTree);

  useEffect(() => {
    // handle reload or  params fetch
    let currTree: any;

    if (list.length && !currentFamilyTree) {
      const target = list.find((tree: any) => tree.id == id);
      const membersList: any = formatTreeMembers(JSON.parse(target?.members || '[]'));

      currTree = membersList?.reduce((mappedNodeIds: any, member: any) => ({ ...mappedNodeIds, [member.node_id]: member }), {});
      dispatch(populateTreeAction(currTree));
    }
  }, [list]);

  // Handle tree data from React Query
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
        <Grid2 container spacing={2} height="100%">
          <Grid2 size={4}>
            Details/description/actions
          </Grid2>
          <Grid2 size={8}>
            <Formik initialValues={{}} onSubmit={() => { }}>
              {(props) => currentFamilyTree ? <GenealogyTree /> : null}
            </Formik>
          </Grid2>
        </Grid2>
      </Box>
    </Page>
  );
}

const mainContainerStyle = {
  height: '80vh',
  width: '100%',
  position: 'absolute',
};

export default ViewFamilyTreeChartPage;

