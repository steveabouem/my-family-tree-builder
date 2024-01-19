import { useContext, useEffect, useState } from "react";
import NotFound from '../common/404NotFound';
import React from "react";
import FamilyCard from "../family/FamilyCard";
import { DFamilyDTO } from "../family/definitions";
import Page from "../common/Page";
import GlobalContext from "../../context/global.context";
import FamilyTreeContext from "../../context/familyTree.context";
import { DProfileProps } from "./definitions";

const UserProfilePage = ({ updateUser }: DProfileProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userFamilies, setUserFamilies] = useState([]);
  const { theme } = useContext(GlobalContext);
  const { currentUser } = useContext(FamilyTreeContext); // TODO: this should even be done directly in the page component

  useEffect(() => {
    const getUserFamilies = async (): Promise<any> => {

    }

    if (currentUser) {
      getUserFamilies()
        .then((data ) => {
          console.log(data);

          setUserFamilies(data);
        })
    }
  }, [currentUser]);

  return currentUser ? (
    <Page subtitle="My profile" isLoading={loading} theme={theme} title={`Welcome ${currentUser?.first_name}`}>
      <div>
        <div>
          <label>Your Families ({userFamilies.length})</label>
          <div>{
            userFamilies.length ? userFamilies.map((family: DFamilyDTO) => (
              <FamilyCard {...family} />
            ))
              : null
          }</div>

          <div>

          </div>
        </div>
      </div>
    </Page>
  ) : (
    <NotFound title="Profile Not Found!" /> // this probably wont be necesarry given redirect

  );

}

export default UserProfilePage;