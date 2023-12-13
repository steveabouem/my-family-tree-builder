import React, { useContext, useEffect } from "react";
import useCookie from "./useCookie.hook";
import { useNavigate } from "react-router";
import FTSessionService from "../../services/FT/session/session.service";
import FamilyTreeContext from "../../context/familyTree.context";

const useAuthValidation = (): void => {
  const cookie = useCookie();
  const navigate = useNavigate();
  const {updateUser} = useContext(FamilyTreeContext);
  
  useEffect(() => {
    if (!(cookie)) {
      navigate('/connect');
    } else {
      const signedUserData = cookie;
      const sessionService = new FTSessionService();
      
      sessionService.getCurrentUser(signedUserData)
        .then(({ data }) => {
          if (data) {
            updateUser(data);
          }
        })
        .catch(e => {
          console.log('Error getting user: ', e);
        });
    }
  }, [cookie]);
}

export default useAuthValidation;