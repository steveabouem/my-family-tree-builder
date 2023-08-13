import { Router, Request, Response, NextFunction } from "express";
import FTAuthService from "../../services/FT/auth/FT.auth.service";
import { FTUserService } from "../../services/FT/user/FT.user.service";
import FTSessionService from "../../services/FT/session/FT.session.service";
import { DSessionUser } from "../definitions";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const authService = new FTAuthService();

  authService.verifyIp(ip)
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
      res.set('Set-Cookie', `session=${sessionData?.token}`);
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
      res.set('Set-Cookie', `session=${sessionData?.token}`);
      res.set('httpOnly', 'true');
      res.status(200);
      res.json({ session: sessionData });
    });
});

router.get('/logout', (req: Request, res: Response) => {
  // TODO: Kill session, send back the guest session default

});

export default router;

// HELPERS
const processRegister = async (req: Request): Promise<DSessionUser | null> => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ftUserService = new FTUserService();
  const ftSessionService = new FTSessionService();
  const formattedValues = { ...req.body, assigned_ips: [ip], created_at: new Date };
  // TODO: use ftuser service to match spouse's first and last name and return id here.
  // in the front, it will be some sort of dd that will use the ServiceWorker, and add the id to the form values
  const newUser = await ftUserService.create(formattedValues);// TODO: catch error

  if (newUser) {
    const sessionToken = await ftSessionService.setSessionUser(newUser);
    return { ...formattedValues, password: '', type: 'user', token: sessionToken };
  }
  return null;
}

const processLogin = async (req: Request): Promise<DSessionUser | null> => {
  const ftAuthService = new FTAuthService();
  const verifiedUser = await ftAuthService.verifyUser(req.body)
    .catch(e => {
      console.log('Error checking user'); //TODO: notify, and proper logging
    });

  if (verifiedUser) {
    const ftSessionService = new FTSessionService();
    const sessionToken = await ftSessionService.setSessionUser(verifiedUser);
    console.log('GOT TOKEN ', sessionToken);
    const currentSession = await ftSessionService.getUserSessionData(sessionToken || '', ['id', 'email', 'first_name', 'last_name', 'gender']);

    return { ...currentSession, type: 'user', token: sessionToken };
  } else {
    return null;
  }
}