import { Router, Request, Response, NextFunction } from "express";
import winston from "winston";
import AuthMiddleware from "../middleware-classes/auth/auth.middleware";
import FamilyMemberController from "../controllers/familyMember/FamilyMemberController";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ftAuthMiddleware = new AuthMiddleware();
  const maxAge = req?.session?.cookie?.expires?.getTime() || 0;
  const now = new Date().getTime();
  const canProceed = maxAge > now;

  if (canProceed) {
    ftAuthMiddleware.verifyIp(ip)
      .then((valid: boolean) => {
        if (!valid) {
          res.status(400);
          res.json('IP is not approved');
        }
      })
      .catch((e: unknown) => {
        winston.log('error', e);
        // ! -TOFIX: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        res.status(500);
        res.json('Error: ' + e);
      });
  } else {
    res.status(403);
    res.json('Session expired');
  }

  next();
})

// ! -TOFIX: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.get('/index', (req: Request, res: Response) => {
  const familyMember = new FamilyMemberController();
  return true;
});

router.post('/create', (req: Request, res: Response) /**TODO: return type */ => {
  const familyMember = new FamilyMemberController();
  return true;
});

export default router;

