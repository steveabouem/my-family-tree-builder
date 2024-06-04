import React from "react";
import { Trans } from "@lingui/macro";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFound from '../common/404NotFound';
import FamilyCard from "../family/FamilyCard";
import Page from "../common/Page";
import FamilyTreeContext from "../../context/creators/familyTree.context";
import { service } from "../../services";
import { DFamilyTree } from "../tree/definitions";
import GlobalContext from "../../context/creators/global.context";
import { Col, Row } from "react-bootstrap";

const ViewFamilyTree = () => {
  const { currentFamilyTree, updateCurrentFamilyTree } = React.useContext(FamilyTreeContext);
  const { toggleLoading, updateModal } = React.useContext(GlobalContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const generations = React.useMemo(() => {
    
  }, [currentFamilyTree]);

  const getCurrentTree = React.useCallback(async (): Promise<any> => {
    const familyTreeService = new service.familyTree();

    if (id) {
      const tree = await familyTreeService.getOne(id)
        .catch(e => {
          console.log('Get FAMILY: ', e);
        });

      return tree;
    } else {
      navigate('/connect');
    }
  }, [id]);


  React.useEffect(() => {
    if (currentFamilyTree) {
      return
    }

    getCurrentTree()
      .then(({ data }) => {
        console.log(data);

        if (!data.error) {
          if (updateCurrentFamilyTree) updateCurrentFamilyTree(data.payload);
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
  }, [currentFamilyTree]);

  return (
    <Page subtitle="" title={`${currentFamilyTree?.name || ''}`}>
    {}
    </Page>
  );
}

export default ViewFamilyTree