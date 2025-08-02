import React, { useEffect } from "react";
import { Box, Grid2 } from "@mui/material";
import {  useParams } from "react-router-dom";
import { Formik } from "formik";
import Page from "components/common/Page";
import { useZDispatch, useZSelector } from "app/hooks";
import { DFamilyTreeState } from "app/slices/definitions";
import { populateTreeAction } from "app/slices/trees";
import { formatTreeMemberDAOList } from "../create/genealogy/utils";
import TreeLayout from 'pages/tree/layout/TreeLayout';
import PageUrlsEnum from "utils/urls";
import { getTreeById } from "services/familyTree";

const ViewFamilyTreeChartPage = () => {
  const dispatch = useZDispatch();
  const { list, currentFamilyTree } = useZSelector<DFamilyTreeState>(state => state.tree);
  const { id } = useParams();

  useEffect(() => {
    // handle reload or  params fetch
    let currTree: any;

    if (list.length && !currentFamilyTree) {
      const target = list.find((tree: any) => tree.id == id);
      const membersList: any = formatTreeMemberDAOList(JSON.parse(target?.members || '[]'));

      currTree = membersList?.reduce((mappedNodeIds: any, member: any) => ({ ...mappedNodeIds, [member.node_id]: member }), {});
      dispatch(populateTreeAction(currTree));
    } else {
      if (id) {
        getTreeById(id)
          .then((res) => {
            currTree = formatTreeMemberDAOList(JSON.parse(res?.data?.payload?.members || '{}'));
            dispatch(populateTreeAction(currTree));

          });
      }
    }
  }, [list]);

  return (
    <Page subtitle="" title={`${currentFamilyTree?.name || ''}`} prevUrl={PageUrlsEnum.trees}>
      <Box height="80vh" width="100%" position="absolute">
        <Grid2 container spacing={2} height="100%">
          <Grid2 size={4}>
            Details/description/actions
          </Grid2>
          <Grid2 size={8}>
            <Formik initialValues={{}} onSubmit={() => { }}>
              {(props) => currentFamilyTree ? <TreeLayout tree={currentFamilyTree} /> : null}
            </Formik>
          </Grid2>
        </Grid2>
      </Box>
    </Page>
  );
}

export default ViewFamilyTreeChartPage;

