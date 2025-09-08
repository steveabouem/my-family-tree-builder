import { Response, Request } from "express";

import logger from "../utils/logger";
import { ServiceResponseWithPayload } from "../services/types";
import { APISessionUser } from "../services/types";

const SESSION_UPDATE_ACTIONS = ['updateProfile', 'changePassword', 'login', 'register'];

export const sendRouteHandlerResponse = <RequestPayload, ResponseType>(
  requestPayload: RequestPayload,
  action: (payload: RequestPayload) => Promise<ServiceResponseWithPayload<ResponseType>>,
  response: Response, 
  actionName: string, 
  request?: Request
): void => {
  logger.info('Processing request', { actionName, payload: requestPayload });

  action(requestPayload)
    .then((data: ServiceResponseWithPayload<ResponseType>) => {
      const returnData = {...data};
      logger.info('Call successful', { actionName, data });
      
      if (request && data.payload) {
        const shouldUpdateSession = SESSION_UPDATE_ACTIONS.includes(actionName.toLowerCase());
        
        if (shouldUpdateSession) {
          const sessionId = generateSessionId(request, data.payload, actionName);
          // @ts-ignore 
          // //TODO: update this AND encrypt/hash emails before sending to local storage
          returnData.payload.sessionId = sessionId;
        }
      }
      
      response.status(data.code);
      response.json(returnData);
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
 * Manages session data based on the action type
 * @param req - Express request object
 * @param details - Data to store in session
 * @param shouldInit - Whether to initialize a new session
 * @param actionName - Name of the action being performed
 */
const generateSessionId = (
  req: Request, 
  details: any, 
  actionName: string
): string | undefined => {
  try {
    if (!req.session) {
      logger.warn('No session available for session management', { actionName });
      return undefined;
    }

    req.session.details = details;
    req.session.sessionId = req.sessionID;
    req.session.save((err) => {
      if (err) {
        logger.error('Failed to save session', { actionName, error: err });
        return;
      }
      
      logger.info('Session updated successfully', { 
        actionName, 
        sessionId: req.sessionID ,
        session: req.session
      });
    });
    
    return req.session?.sessionId || '';

  } catch (error) {
    logger.error('Session management failed', { actionName, error });
    return undefined;
  }
};

/**
 * Helper function to get current session user data
 * @param req - Express request object
 * @returns Session user data or null if not available
 */
export const getSessionUser = (req: Request): Partial<APISessionUser> | null => {
  try {
    return req.session?.details || null;
  } catch (error) {
    logger.error('Failed to get session user', { error });
    return null;
  }
};

/**
 * Helper function to check if user is authenticated
 * @param req - Express request object
 * @returns Boolean indicating if user is authenticated
 */
export const isUserAuthenticated = (req: Request): boolean => {
  try {
    const sessionUser = getSessionUser(req);
    return !!(sessionUser && sessionUser.authenticated);
  } catch (error) {
    logger.error('Failed to check authentication status', { error });
    return false;
  }
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