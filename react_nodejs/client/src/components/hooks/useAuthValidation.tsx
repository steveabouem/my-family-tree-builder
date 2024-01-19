import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SessionService from "../../services/session/session.service";
import FamilyTreeContext from "../../context/familyTree.context";

const useAuthValidation = (): void => {
  const navigate = useNavigate();
  const {updateUser} = useContext(FamilyTreeContext);
  
  useEffect(() => {
    const sessionService = new SessionService();
    if (localStorage.length) {
      const currentSession = JSON.parse(localStorage.getItem('FT') || '');
      console.log(currentSession);
      
      if (currentSession?.sessionId) {
        
        sessionService.getCurrent(currentSession.sessionId)
          .then(({data} ) => {
            console.log({data});
            //TODO: "there's got to be a better way!"
            if (data.error) {
              navigate('/connect');
            } else {
              if (data?.data?.data) {
                const currentUser = JSON.parse(data.data.data); // ! <=
                console.log(currentUser);
                updateUser(data);
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

export default useAuthValidation;