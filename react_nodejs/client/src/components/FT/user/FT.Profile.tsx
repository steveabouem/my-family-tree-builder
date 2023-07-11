import { useEffect, useState } from "react";
import { DUserDTO } from "../../../services/FT/auth/auth.definitions";
import FTUserService from "../../../services/FT/user/user.service";
import NotFound from '../../common/404NotFound';
import React from "react";
import useUrlId from "../../hooks/useUrl.hooks";
import FamilyService from "../../../services/FT/fam/family.service";
import FamilyCard from "../family/FamilyCard";
import { DFTFamilyDTO } from "../family/definitions";
import { useCookies } from "react-cookie";

const FTUserProfilePage = (): JSX.Element => {
  const [userData, setUserData] = useState<DUserDTO | undefined>();
  const [userFamilies, setUserFamilies] = useState([]);
  const [cookies, setCookie] = useCookies(['FT'])

  const path = useUrlId('/ft/user/');

  useEffect(() => {
    // TODO: get all this data from redux/context to avoid url injection (might not be necessary given the ip restrictions)
    if (path) {
      console.log(cookies);
      
      // const populateUser = async () => {
      //   const ftUserService = new FTUserService('users');
      //   // TODO: no any
      //   const { data }: any = await ftUserService.getById(parseInt(path));
      //   return (data);
      // }
      // populateUser()
      //   .then((user: any) => {
      //     console.log({ user });
      //     setUserData(user);
      //   });
    }
  }, []);

  useEffect(() => {
    const getUserFamilies = async (): Promise<any> => {
      const ftFamilyService = new FamilyService();
      const families = await ftFamilyService.getFamilyBullkData(`${userData?.related_to?.join(',') || ''} `);

      return families
    }

    if (userData && path) {
      getUserFamilies()
        .then(({data}) => {
          console.log(data);

          setUserFamilies(data);
        })
    }
  }, [userData, path]);

  return userData ? (
    <div>
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
    </div>
  ) : (
    <NotFound title="Profile Not Found!" />
  );

}

export default FTUserProfilePage;