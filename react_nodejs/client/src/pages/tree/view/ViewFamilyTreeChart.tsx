import React, { useContext, useEffect, useMemo, useState } from "react";
import { Trans } from "@lingui/macro";
import { Box, Grid2 } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import Page from "components/common/Page";
import { useZDispatch, useZSelector } from "app/hooks";
import { DFamilyTreeState } from "app/slices/definitions";
import { populateTreeAction } from "app/slices/trees";
import { formatTreeMemberDAOList } from "../create/genealogy/utils";
import TreeLayout from 'pages/tree/layout/TreeLayout';
import FamilyTreeService from "services/familyTree/familyTree.service";
import PageUrlsEnum from "utils/urls";

const ViewFamilyTreeChartPage = () => {
  const dispatch = useZDispatch();
  const { list, currentFamilyTree } = useZSelector<DFamilyTreeState>(state => state.tree);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // handle reload or  params fetch
    let currTree: any;

    if (list.length && !currentFamilyTree) {
      const target = list.find((tree: any) => tree.id == id);
      const membersList: any = formatTreeMemberDAOList(JSON.parse(target?.members || '[]'));

      currTree = membersList?.reduce((mappedNodeIds: any, member: any) => ({ ...mappedNodeIds, [member.node_id]: member }), {});
      dispatch(populateTreeAction(currTree));
    } else {
      const familyTreeService = new FamilyTreeService();

      if (id) {
        familyTreeService.getOne(id)
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

