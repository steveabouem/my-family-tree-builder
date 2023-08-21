import { useContext, useEffect, useState } from "react";
import { DUserDTO } from "../../../services/FT/auth/auth.definitions";
import FTUserService from "../../../services/FT/user/user.service";
import NotFound from '../../common/404NotFound';
import React from "react";
import FamilyService from "../../../services/FT/fam/family.service";
import FamilyCard from "../family/FamilyCard";
import { DFTFamilyDTO } from "../family/definitions";
import { useCookies } from "react-cookie";
import Page from "../../common/Page";
import GlobalContext from "../../../context/global.context";
import { useNavigate } from "react-router";

const FTUserProfilePage = (): JSX.Element => {
  const [userData, setUserData] = useState<DUserDTO | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [userFamilies, setUserFamilies] = useState([]);
  const { theme, session } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(document.cookie);
    if (!document.cookie)
    navigate(`/ft`);
  });

  useEffect(() => {
    const getUserFamilies = async (): Promise<any> => {
      const ftFamilyService = new FamilyService();
      const families = await ftFamilyService.getFamilyBullkData(`${userData?.related_to?.join(',') || ''} `);

      return families
    }

    if (userData) {
      getUserFamilies()
        .then(({data}) => {
          console.log(data);

          setUserFamilies(data);
        })
    }
  }, [userData]);

  return userData ? (
    <Page title="My profile" isLoading={loading} theme={theme} subTitle="">
      Welcome {userData.first_name}
      <div>
        <h2>Your Profile:</h2>
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
    <NotFound title="Profile Not Found!" />
  );

}

export default FTUserProfilePage;