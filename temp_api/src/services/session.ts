import logger from "../utils/logger";
import Session from "../models/Session";
import { APIGetSessionResponse, ServiceResponseWithPayload } from "./types";

export const getCurrentSession = async (id: string): Promise<ServiceResponseWithPayload<APIGetSessionResponse>> => {
  let response = {
    error: true,
    code: 500,
    payload: { authenticated: false, active: false, user: null }
  };
  
  const currentSession = await Session.findByPk(id);
  logger.info('Searching for session', {currentSession, id})

  if (currentSession?.stale_time) {
    const currentTime = Date.now(); // Current time in milliseconds since epoch
    const staleTimeMs = currentSession.stale_time * 1000; // Convert seconds to milliseconds
    logger.info('Session expiry compare: ', {staleTime: staleTimeMs, currentTime, currentSession})

    if (staleTimeMs < currentTime) {
      response.payload.active = false;
    } else {
      response.payload.active = true;
    }
    // @ts-ignore
    response.payload.user = currentSession.data.details;
    response.code = 200;
    response.error = false;
  } else {
    response.code = 200;
    response.error = false;
  }

  return response;
}