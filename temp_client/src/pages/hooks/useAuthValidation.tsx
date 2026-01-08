import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import PageUrlsEnum from "utils/urls";
import { useGetCurrentSession } from "services/v2";
import { useZDispatch, useZSelector } from "app/hooks";
import { refreshUserAction, updateUserAction } from "app/slices/user";
import { UserState } from "types";

const useSessionValidation = (): void => {
  const { currentUser } = useZSelector((state: { user: UserState }) => state.user);
  const dispatch = useZDispatch();
  const navigate = useNavigate();
  const sessionData = localStorage?.getItem(`${process.env.REACT_APP_LOCALE_STORAGE_NAME}`);
  const storedSession = JSON.parse(sessionData || '{}');
  const { data, isFetching, isLoading,  } = useGetCurrentSession(storedSession.sessionId || 'x');

  useEffect(() => {
    dispatch(refreshUserAction());
  }, []);
  useEffect(() => {
    if (isFetching || isLoading || currentUser?.userId) {
      return
    }

    if (data?.payload?.active) {
      dispatch(updateUserAction(data.payload.user));
    } else {
      navigate(PageUrlsEnum.auth);
    }
  }, [data, isFetching, isLoading, currentUser?.userId]);
};

export default useSessionValidation;