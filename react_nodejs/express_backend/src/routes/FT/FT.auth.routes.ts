import { Router, Request, Response, NextFunction } from "express";
import FTAuthMiddleware from "../../middleware-classes/FT/auth/FT.auth.middleware";
import { FTUserMiddleware } from "../../middleware-classes/FT/user/FT.user.middleware";
import FTSessionMiddleware from "../../middleware-classes/FT/session/FT.session.middleware";
import { DSessionUser } from "../definitions";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const authMiddleware = new FTAuthMiddleware();

  authMiddleware.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(400);
        res.json({ ipIsValid: false });
      }
    })
    .catch(e => {
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      res.status(400);
      res.json({ ipIsValid: false, message: e });
    });
  next();
});

// TODO: typing of req body for 
router.post('/register', (req: Request, res: Response) => {
  processRegister(req)
    .then((sessionData: DSessionUser | null) => {
      res.set('Set-Cookie', `${sessionData?.token}`);
      res.set('httpOnly', 'true');
      res.status(200);
      res.json({ session: sessionData });
    })
    .catch(e => {
      // TODO: error handling and logging
      console.log('Register Error: ', e);

    });
});

// TODO: req, res typing
router.post('/login', (req: Request, res: Response) => {
  processLogin(req)
    .then((sessionData: DSessionUser | null) => {
      res.set('Set-Cookie', `${sessionData?.token}`);
      res.set('httpOnly', 'true');
      res.status(200);
      res.json({ session: sessionData });
    });
});

router.post('/logout', (req: Request, res: Response) => {
  // TODO: Kill session, send back the guest session default
  res.set('Set-Cookie', 'FT=;');
  res.set('httpOnly', 'true');
  res.status(200);
  res.json({ session: undefined });
});

export default router;

// HELPERS
const processRegister = async (req: Request): Promise<DSessionUser | null> => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ftUserMiddleware = new FTUserMiddleware();
  const ftSessionMiddleware = new FTSessionMiddleware();
  const formattedValues = { ...req.body, assigned_ips: [ip], created_at: new Date };
  // TODO: use ftuser middleware to match spouse's first and last name and return id here.
  // in the front, it will be some sort of dd that will use the MiddlewareWorker, and add the id to the form values
  // This will go in the profile Selection, no need to crowd registration w it
  const duplicate = await ftUserMiddleware.getByEmail(req.body.email);
  if (duplicate) {
    // TODO: throw error + logging
    return null;
  }

  const newUser = await ftUserMiddleware.create(formattedValues).catch(e => console.log('Error creating U: ', e));// TODO: catch error logging

  if (newUser) {
    const sessionToken = await ftSessionMiddleware.setSession(newUser);
    return { type: 'user', token: sessionToken, id: newUser?.id || 0 }; // INFO: only send back the id, the token holds the rest and will be dealt with in the front
  }

  return null;
}

const processLogin = async (req: Request): Promise<DSessionUser | null> => {
  const ftAuthMiddleware = new FTAuthMiddleware();
  const verifiedUser = await ftAuthMiddleware.verifyUser(req.body)
    .catch(e => {
      console.log('Error checking user'); //TODO: notify, and proper logging
    });

  if (verifiedUser) {
    console.log('User was verified succesfuly');

    const ftSessionMiddleware = new FTSessionMiddleware();
    const sessionToken = await ftSessionMiddleware.setSession(verifiedUser);
    console.log('GOT TOKEN ', sessionToken);
    const currentSession = await ftSessionMiddleware.getSessionData(sessionToken || '', ['id', 'email', 'first_name', 'last_name', 'gender']);

    return { ...currentSession, id: 1, type: 'user', token: sessionToken };
  } else {
    return null;
  }
}