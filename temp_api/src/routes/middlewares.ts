import { isUserAuthenticated } from "./helpers";

export const authCheck = (req: any, res: any, next: any) => {
  const publicUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/register'];
  const userAuthenticated = isUserAuthenticated(req);

  if (userAuthenticated || publicUrls.includes(req.url)) {
    next();
  } else {
    res.status(403);
    res.json({
      error: true,
      code: 403,
      message: 'Unauthenticated',
      payload: null
    });
  }
};