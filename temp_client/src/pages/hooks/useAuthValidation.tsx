import React from "react";
import FamilyTreeContext from "contexts/creators/familyTree";
import { useNavigate } from "react-router";
import {useLocation} from "react-router"
import {getCurrent} from "services/session";
import PageUrlsEnum from "utils/urls";

const useSessionValidation = (): void => {
  const navigate = useNavigate();
  const location = useLocation();
  const {updateUser} = React.useContext(FamilyTreeContext);
  
  React.useEffect(() => {
    if (location.pathname === '/') {
      return;
    }

    if (localStorage.length) {
      const currentSession = JSON.parse(localStorage.getItem(`${process.env.REACT_APP_LOCALE_STORAGE_NAME}`) || '{}');
      if (currentSession?.sessionId) {
        getCurrent(currentSession.sessionId)
          .then(({data} ) => {
            if (data.error) {
              navigate(PageUrlsEnum.auth);
            } else {
              if (data?.data?.payload) {// ! <= this is hilarious. fix it.
                const currentUser = JSON.parse(data.data.payload);
                if (updateUser)
                updateUser(currentUser);
              }
            }
          })
          .catch((e: unknown) => {
            console.log('Error getting user: ', e);
          });
      }
    } else {
      navigate(PageUrlsEnum.auth);
    }
  }, []);
}

export default useSessionValidation;