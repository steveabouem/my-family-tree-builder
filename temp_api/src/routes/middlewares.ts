import logger from "../utils/logger";
import { isUserAuthenticated } from "./helpers";

export const authCheck = async (req: any, res: any, next: any) => {
  const publicUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/register'];
  
  // Check if this is a public URL (check multiple URL properties for robustness)
  const isPublicUrl = publicUrls.some(url => 
    req.url === url || 
    req.path === url || 
    req.originalUrl === url ||
    req.url?.startsWith(url) ||
    req.path?.startsWith(url) ||
    req.originalUrl?.startsWith(url)
  );
  
  // If it's a public URL, allow access
  if (isPublicUrl) {
    return next();
  }
  
  // Ensure session is loaded - reload if session exists but details are missing
  if (req.sessionID && req.session && !req.session.details) {
    try {
      // Try to reload the session from the store
      await new Promise<void>((resolve, reject) => {
        req.session.reload((err: any) => {
          if (err) {
            logger.error('authCheck - Failed to reload session', { error: err, sessionId: req.sessionID });
            // Don't reject - continue with authentication check even if reload fails
            resolve();
          } else {
            logger.info('authCheck - Session reloaded successfully', { sessionId: req.sessionID, details: req.session.details });
            resolve();
          }
        });
      });
    } catch (error) {
      logger.error('authCheck - Session reload error', { error, sessionId: req.sessionID });
      // Continue with authentication check even if reload fails
    }
  }
  
  // Log session details for debugging
  logger.info('authCheck - Session check', {
    url: req.url,
    path: req.path,
    originalUrl: req.originalUrl,
    sessionId: req.sessionID,
    hasSession: !!req.session,
    sessionDetails: req?.session?.details,
    cookie: req.headers.cookie,
  });
  
  const userAuthenticated = isUserAuthenticated(req);
  
  if (userAuthenticated) {
    return next();
  } else {
    logger.error('authCheck - Unauthenticated request', {
      url: req.url,
      path: req.path,
      originalUrl: req.originalUrl,
      sessionId: req.sessionID,
      hasSession: !!req.session,
      sessionDetails: req?.session?.details,
      userAuthenticated,
    });
    res.status(403);
    res.json({
      error: true,
      code: 403,
      message: 'Unauthenticated',
      payload: null
    });
  }
};