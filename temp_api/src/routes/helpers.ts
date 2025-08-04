import { Response, Request } from "express";
import logger from "../utils/logger";
import { ServiceResponseWithPayload } from "../services/types";
import { APISessionUser } from "../services/types";

const SESSION_INIT_ACTIONS = ['login', 'register'];
const SESSION_UPDATE_ACTIONS = ['updateProfile', 'changePassword'];

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
      logger.info('Call successful', { actionName, data });
      
      if (request && data.payload) {
        const shouldInitSession = SESSION_INIT_ACTIONS.includes(actionName);
        const shouldUpdateSession = SESSION_UPDATE_ACTIONS.includes(actionName);
        
        if (shouldInitSession || shouldUpdateSession) {
          manageSessionData(request, data.payload, shouldInitSession, actionName);
        }
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
 * Manages session data based on the action type
 * @param req - Express request object
 * @param details - Data to store in session
 * @param shouldInit - Whether to initialize a new session
 * @param actionName - Name of the action being performed
 */
const manageSessionData = (
  req: Request, 
  details: any, 
  shouldInit: boolean, 
  actionName: string
): void => {
  try {
    if (!req.session) {
      logger.warn('No session available for session management', { actionName });
      return;
    }

    logger.info('Managing session data', { 
      actionName, 
      shouldInit, 
      hasExistingSession: !!req.session.details 
    });

    if (shouldInit) {
      logger.info('Crating session')
      req.session.regenerate((err) => {
        if (err) {
          logger.error('Failed to regenerate session', { actionName, error: err });
          return;
        }
        
        req.session.details = details;
        req.session.sessionId = req.sessionID;
        
        logger.info('Session initialized successfully', { 
          actionName, 
          sessionId: req.sessionID 
        });
      });
    } else {
      logger.info('Updating session')
      req.session.details = details;
      req.session.sessionId = req.sessionID;
      
      req.session.save((err) => {
        if (err) {
          logger.error('Failed to save session', { actionName, error: err });
          return;
        }
        
        logger.info('Session updated successfully', { 
          actionName, 
          sessionId: req.sessionID 
        });
      });
    }
  } catch (error) {
    logger.error('Session management failed', { actionName, error });
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