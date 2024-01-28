import { useContext, useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import React from "react";
import NotFound from '../common/404NotFound';
import FamilyCard from "../family/FamilyCard";
import { DFamilyDTO } from "../family/definitions";
import Page from "../common/Page";
import GlobalContext from "../../context/creators/global.context";
import FamilyTreeContext from "../../context/creators/familyTree.context";
import { DProfileProps } from "./definitions";
import service from "../../services";
import ButtonRounded from "../common/buttons/Rounded";
import { Link } from "react-router-dom";

const UserProfilePage = ({ updateUser }: DProfileProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userTrees, setUserTrees] = useState<any[]>([]);
  const { theme } = useContext(GlobalContext);
  const { currentUser } = useContext(FamilyTreeContext); // ! -TOFIX: this should even be done directly in the page component

  useEffect(() => {
    const getUserTrees = async (): Promise<any> => {
      const familyTreeService = new service.familyTre();
      const userId = currentUser?.userId;

      if (userId) {
        const families = await familyTreeService.getAllForUser(userId);
        setUserTrees(families.data);
      }
    }

    if (currentUser) {
      getUserTrees()
        .then((data) => {
          console.log({ data });
          setUserTrees(data);
          setLoading(false);
        })
        .catch(e => {

        });
    }
  }, [currentUser]);

  return currentUser ? (
    <Page subtitle="My profile" isLoading={loading} title={`Welcome ${currentUser?.firstName || ''}`}>
      <div className="row">
        <div className="col-md-6">
          {userTrees?.length ?
            <>
              <label><Trans>your_tree_title</Trans> ({userTrees?.length || 0})</label>
              <div>
                {
                  userTrees.map((family: DFamilyDTO) => (
                    <FamilyCard {...family} />
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