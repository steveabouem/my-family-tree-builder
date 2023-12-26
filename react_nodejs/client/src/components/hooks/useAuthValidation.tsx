import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SessionService from "../../services/session/session.service";
import FamilyTreeContext from "../../context/familyTree.context";

const useAuthValidation = (): void => {
  const navigate = useNavigate();
  const {updateUser} = useContext(FamilyTreeContext);
  
  useEffect(() => {
    const sessionService = new SessionService();
    const id = document.cookie;
    sessionService.getCurrent(1)
      .then(({ data }) => {
        if (data) {
          updateUser(data);
          } else {
          navigate('/connect');
        }
      })
      .catch((e: unknown) => {
        console.log('Error getting user: ', e);
      });
  }, []);
}

export default useAuthValidation;