import FamilyTreeContext from "contexts/creators/familyTree";
import React from "react";
import { useNavigate } from "react-router";
import {useLocation} from "react-router"
import SessionService from "services/session/session.service";
import PageUrlsEnum from "utils/urls";

const useSessionValidation = (): void => {
  const navigate = useNavigate();
  const location = useLocation();
  const {updateUser} = React.useContext(FamilyTreeContext);
  
  React.useEffect(() => {
    const sessionService = new SessionService();
    if (location.pathname === '/') {
      return;
    }

    if (localStorage.length) {
      const currentSession = JSON.parse(localStorage.getItem('FT') || '');
      if (currentSession?.sessionId) {
        sessionService.getCurrent(currentSession.sessionId)
          .then(({data} ) => {
            //TODO: "there's got to be a better way!"
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