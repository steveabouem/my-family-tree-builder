import Session from "../models/Session";
import logger from "../utils/logger";

export const authCheck = async (req: any, res: any, next: any) => {
  const publicUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/register'];
  const session = await Session.findByPk(req?.sessionID);
  const isPublicUrl = publicUrls.some(url =>
    req.url === url ||
    req.path === url ||
    req.originalUrl === url ||
    req.url?.startsWith(url) ||
    req.path?.startsWith(url) ||
    req.originalUrl?.startsWith(url)
  );
  logger.info('IN FUNCTION RESULT ', { currS: session?.dataValues?.data })
  
  if (isPublicUrl) {
    return next();
  }

  if (!session || !session?.dataValues?.data) {
    return res.status(403).json({
      error: true,
      code: 403,
      message: "Unauthenticated",
      payload: null,
    });
  }

  next();
};