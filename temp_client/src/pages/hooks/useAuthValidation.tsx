import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import PageUrlsEnum from "utils/urls";
import { useGetCurrentSession } from "api";
import { useZDispatch, useZSelector } from "app/hooks";
import { refreshUserAction, updateUserAction } from "app/slices/user";
import { UserState } from "types";

const useSessionValidation = (): void => {
  const { currentUser } = useZSelector((state: { user: UserState }) => state.user);
  const dispatch = useZDispatch();
  const navigate = useNavigate();
  const sessionData = localStorage?.getItem(`${process.env.REACT_APP_LOCALE_STORAGE_NAME}`);
  const storedSession = JSON.parse(sessionData || '{}');
  // TODO: cookie's age to mnust handled in the api, through a middlewRe. shouldnt need to call a separate endpoint for this
  const isStale = !storedSession?.expires || storedSession?.expires && new Date(storedSession.expires) > new Date();
  const { data, isFetching, isLoading,  } = useGetCurrentSession(storedSession.sessionId || 'x', isStale);

  useEffect(() => {
    console.log('mounting hook', sessionData);
  }, []);
  useEffect(() => {
    dispatch(refreshUserAction());
  }, []);
  useEffect(() => {
    if (isFetching || isLoading || currentUser?.userId) {
      return
    }

    if (data?.payload?.active) {// info provided by api, the expires prop is meant for front exclusively, and safe for consumption
      localStorage.setItem(`${process.env.REACT_APP_LOCALE_STORAGE_NAME}`, JSON.stringify({...storedSession, expires: data.payload.expires}));
      dispatch(updateUserAction(data.payload.user));
    } else {
      navigate(PageUrlsEnum.auth);
    }
  }, [data, isFetching, isLoading, currentUser?.userId]);
};

export default useSessionValidation;