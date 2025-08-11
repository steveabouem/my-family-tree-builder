import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import PageUrlsEnum from "utils/urls";
import { useGetCurrentSession } from "services/v2";
import { useZDispatch, useZSelector} from "app/hooks";
import { updateUserAction } from "app/slices/user";
import { DUserState } from "app/slices/definitions";

const useSessionValidation = (): void => {
  // const [evaluating, setEvaluating] = useState(true);
  const dispatch = useZDispatch();
  const navigate = useNavigate();
  const {currentUser} = useZSelector<DUserState>(state => state.user)
  const sessionData = localStorage?.getItem(`${process.env.REACT_APP_LOCALE_STORAGE_NAME}`);
  const storedSession = JSON.parse(sessionData || '{}');
  const {data, error} = useGetCurrentSession(storedSession.sessionId || 'x');
  
  useEffect(() => {
    if (data?.payload?.active) {
      dispatch(updateUserAction(data.payload.user));
    } else {
      
    }
  }, [data]);

  useEffect(() => {
    if (!currentUser?.authenticated) {
      // navigate(PageUrlsEnum.auth);
    }
  }, [currentUser])
}

export default useSessionValidation;