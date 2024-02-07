import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SessionService from "../../services/session/session.service";
import FamilyTreeContext from "../../context/creators/familyTree.context";

const useSession = (): void => {
  const navigate = useNavigate();
  const {updateUser} = useContext(FamilyTreeContext);
  
  useEffect(() => {
    const sessionService = new SessionService();
    if (localStorage.length) {
      const currentSession = JSON.parse(localStorage.getItem('FT') || '');
      
      if (currentSession?.sessionId) {
        sessionService.getCurrent(currentSession.sessionId)
          .then(({data} ) => {
            //TODO: "there's got to be a better way!"
            if (data.error) {
              navigate('/connect');
            } else {
              if (data?.data?.data) {// ! <= this is hilarious. fix it.
                const currentUser = JSON.parse(data.data.data);
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
      navigate('/connect');
    }
  }, []);
}

export default useSession;