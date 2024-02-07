import { useCallback, useContext, useEffect } from "react";
import { Trans } from "@lingui/macro";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFound from '../common/404NotFound';
import FamilyCard from "../family/FamilyCard";
import Page from "../common/Page";
import FamilyTreeContext from "../../context/creators/familyTree.context";
import {service} from "../../services";
import { DFamilyTree } from "../tree/definitions";
import GlobalContext from "../../context/creators/global.context";

const UserProfilePage = (): JSX.Element => {
  const { currentUser, familyTrees, updateFamilyTrees } = useContext(FamilyTreeContext);
  const { toggleLoading, updateModal } = useContext(GlobalContext);
  const {id} = useParams();
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
      navigate('/connect');
    }
  }, [currentUser, id]);


  useEffect(() => {
    if (currentUser?.userId) {
      getfamilyTrees()
        .then(({data}) => {
          if (!data.error) {
            if (updateFamilyTrees) updateFamilyTrees(data.data);
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
      <div className="row">
        <div className="col-md-6">
          {familyTrees?.length ?
            <>
              <label><Trans>your_tree_title</Trans> ({familyTrees?.length || 0})</label>
              <div>
                {
                  familyTrees.map((tree: Partial<DFamilyTree>) => (
                    <FamilyCard {...tree} />
                  ))
                }
              </div>
            </>
            :
            <>
              <label><Trans>manage_your_tree_title</Trans></label>
              <div> <Link to="/family-tree"><Trans>go_check_my_tree</Trans></Link></div>
            </>
          }
        </div>
      </div>
    </Page>
  ) : (
    <NotFound title="Profile Not Found!" /> // this probably wont be necesarry given redirect
  );
}

export default UserProfilePage;