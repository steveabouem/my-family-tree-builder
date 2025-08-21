import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import PageUrlsEnum from "utils/urls";
import { useGetCurrentSession } from "services/v2";
import { useZDispatch} from "app/hooks";
import { updateUserAction } from "app/slices/user";

const useSessionValidation = (): void => {
  const dispatch = useZDispatch();
  const navigate = useNavigate();
  const sessionData = localStorage?.getItem(`${process.env.REACT_APP_LOCALE_STORAGE_NAME}`);
  const storedSession = JSON.parse(sessionData || '{}');
  const {data, isFetching, isLoading} = useGetCurrentSession(storedSession.sessionId || 'x');
  
  useEffect(() => {
    if (isFetching || isLoading) {
      return
    }

    if (data?.payload?.active) {
      dispatch(updateUserAction(data.payload.user));
    } else {
      navigate(PageUrlsEnum.auth);
    }
  }, [data, isFetching, isLoading]);
};

export default useSessionValidation;