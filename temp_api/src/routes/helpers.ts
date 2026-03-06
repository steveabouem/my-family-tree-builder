import { Response, Request } from "express";

import logger from "../utils/logger";
import { ServiceResponseWithPayload } from "../services/types";
import { APISessionUser } from "../services/types";

export const sendRouteHandlerResponse = <RequestPayload, ResponseType>(
  requestPayload: RequestPayload,
  action: (payload: RequestPayload) => Promise<ServiceResponseWithPayload<ResponseType>>,
  response: Response,
  actionName: string,
  request?: Request,
): void => {
  // you'r ismanaging ssion pn dirait. localstorag id should b same as session in db. it also looks like dozens of Session records are creatvd
  // TODO: supabase and vercel, and Im sure other PAAS offer built in sign in with providers (google, github, etc)

  action(requestPayload)
    .then((data: ServiceResponseWithPayload<ResponseType>) => {
      logger.info('Call successful', { actionName, data });
      if (request && data.payload && data?.addToSession) {
        request.session.details = { ...request?.session?.details || {}, ...data.payload };
        request.session.save((err) => {
          if (err) {
            logger.error('Failed to save session', { error: err, sessionId: request.sessionID });
          } else {
            logger.info('Updated Express session: ', {session: request.session});
          }
        });
        // //TODO: update this AND encrypt/hash emails before sending to local storage
      }
      response.status(data.code);
      response.json(data);
    })
    .catch((e: unknown) => {
      logger.error(`${actionName}: failed operation`, e);
      response.status(500);
      response.json({
        error: true,
        code: 500,
        message: 'Internal server error',
        payload: null
      });
    });
};

/**
 * Helper function to get current session user data
 * @param req - Express request object
 * @returns Session user data or null if not available
 */
export const getSessionUser = (req: Request): Partial<APISessionUser> | null => {
  logger.info('SESSION ', req?.session);

  return req.session?.details || null;
};

/**
 * Helper function to check if user is authenticated
 * @param req - Express request object
 * @returns Boolean indicating if user is authenticated
 */
export const isUserAuthenticated = (req: Request): boolean => {
  // Check if session exists first
  if (!req?.session) {
    logger.info('Session VALIDATOR - No session found', { hasSession: false });
    return false;
  }
  
  const hasUserDetails = !!req.session.details?.userId;
  let active = true;
  
  // Safely check cookie expiration
  if (req.session.cookie?.expires) {
    active = new Date(req.session.cookie.expires) > new Date();
  }
  
  logger.info('Session VALIDATOR ', { 
    hasSession: !!req.session,
    sessionId: req.sessionID,
    details: req.session.details,
    active, 
    hasUserDetails 
  });
  
  // the presence of the details object means all the user info is available in the session store. Block otherwise
  return hasUserDetails && active; 
};

/**
 * Helper function to clear session data
 * @param req - Express request object
 * @param callback - Optional callback after session destruction
 */
export const clearSession = (req: Request, callback?: () => void): void => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          logger.error('Failed to destroy session', { error: err });
        } else {
          logger.info('Session destroyed successfully');
        }
        if (callback) callback();
      });
    } else if (callback) {
      callback();
    }
  } catch (error) {
    logger.error('Failed to clear session', { error });
    if (callback) callback();
  }
};