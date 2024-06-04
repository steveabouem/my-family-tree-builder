import { Trans } from "@lingui/macro";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFound from '../common/404NotFound';
import Page from "../common/Page";
import FamilyTreeContext from "../../context/creators/familyTree.context";
import { service } from "../../services";
import GlobalContext from "../../context/creators/global.context";
import { Col, Row } from "react-bootstrap";

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
      <Row>
        <Col md="6">
          <label>
            {
              familyTrees?.length ? <><Trans>your_tree_title</Trans> ({familyTrees?.length || 0}) </>
                : <Trans>manage_your_tree_title</Trans>
            }
          </label>
        </Col>
      </Row>
      {
        familyTrees?.map((tree: any, index: number) => (
          <Row>
            <Col md="3">
              {tree?.name}
            </Col>
            <Col md="2">
              <Link to={`/family-trees/${tree?.id || ''}`}><Trans>go_check_my_tree</Trans></Link>
            </Col>
          </Row>
        ))
      }
    </Page>
  ) : (
    <NotFound title="Profile Not Found!" /> // this probably wont be necesarry given redirect
  );
}

export default UserProfilePage;