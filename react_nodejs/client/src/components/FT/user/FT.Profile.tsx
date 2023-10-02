import { useContext, useEffect, useState } from "react";
import { DUserDTO } from "../../../services/FT/auth/auth.definitions";
import FTUserService from "../../../services/FT/user/user.service";
import FTSessionService from "../../../services/FT/session/session.service";
import NotFound from '../../common/404NotFound';
import React from "react";
import FamilyService from "../../../services/FT/fam/family.service";
import FamilyCard from "../family/FamilyCard";
import { DFTFamilyDTO } from "../family/definitions";
import Page from "../../common/Page";
import GlobalContext from "../../../context/global.context";
import { useNavigate } from "react-router";
import FamilyTreeContext from "../../../context/FT/familyTree.context";
import { DProfileProps } from "./definitions";

const FTUserProfilePage = ({ updateUser }: DProfileProps): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userFamilies, setUserFamilies] = useState([]);
  const { theme } = useContext(GlobalContext);
  const { currentUser } = useContext(FamilyTreeContext);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    const getUserFamilies = async (): Promise<any> => {
      const ftFamilyService = new FamilyService();
      const families = await ftFamilyService.getFamilyBullkData(`${currentUser?.related_to?.join(',') || ''} `);

      return families
    }

    if (currentUser) {
      getUserFamilies()
        .then(({ data }) => {
          console.log(data);

          setUserFamilies(data);
        })
    }
  }, [currentUser]);

  const getCurrentUser = () => {
    if (!document.cookie) {
      navigate('/connect');
    } else {
      const sessionService = new FTSessionService();
      sessionService.getCurrentUser(document.cookie)
        .then(({ data }) => {
          if (data) {
            updateUser(data);
            setLoading(false);
          }
        })
        .catch(e => {
          console.log('Error getting user: ', e);
        });
    }
  }

  return currentUser ? (
    <Page subtitle="My profile" isLoading={loading} theme={theme} title={`Welcome ${currentUser?.first_name}`}>
      <div>
        <div>
          <label>Your Families ({userFamilies.length})</label>
          <div>{
            userFamilies.length ? userFamilies.map((family: DFTFamilyDTO) => (
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

export default FTUserProfilePage;