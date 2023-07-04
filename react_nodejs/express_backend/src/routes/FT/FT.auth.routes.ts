import { Router, Request, Response, NextFunction } from "express";
import FTAuthService from "../../services/FT/auth/FT.auth.service";
import { FTUserService } from "../../services/FT/user/FT.user.service";
import { DFTUserDTO } from "../../services/FT/user/FT.user..definitions";
import FTSessionService from "../../services/FT/session/FT.session.service";
import { DSessionUser } from "../definitions";

const router = Router();

router.use((p_req: Request, p_res: Response, p_next: NextFunction) => {
  const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
  const authService = new FTAuthService();

  authService.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        p_res.status(400);
        p_res.json({ ipIsValid: false });
      }
    })
    .catch(e => {
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      p_res.status(400);
      p_res.json({ ipIsValid: false, message: e });
    });


  p_next();
});

// TODO: typing of req body for p_
router.post('/register', (p_req: Request, p_res: Response) => {
  processRegister(p_req)
    .then((sessionData: DSessionUser | null) => {
      p_res.set('Set-Cookie', `session=${sessionData?.token}`);
      p_res.set('httpOnly', 'true');
      p_res.status(200);
      p_res.json({ session: sessionData });
    });
});

// TODO: req, res typing
router.post('/login', (p_req: Request, p_res: Response) => {
  processLogin(p_req)
    .then((sessionData: DSessionUser | null) => {
      p_res.set('Set-Cookie', `session=${sessionData?.token}`);
      p_res.set('httpOnly', 'true');
      p_res.status(200);
      p_res.json({ session: sessionData });
    });
});

router.get('/logout', (p_req: Request, p_res: Response) => {
  // TODO: Kill session, send back the guest session default

});

export default router;

// HELPERS
const processRegister = async (p_req: Request): Promise<DSessionUser | null> => {
  const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
  const ftUserService = new FTUserService();
  const ftSessionService = new FTSessionService(p_req.body.sessionToken);
  const formattedValues = { ...p_req.body, assigned_ips: [ip], created_at: new Date };
  // TODO: use ftuser service to match spouse's first and last name and return id here.
  // in the front, it will be some sort of dd that will use the ServiceWorker, and add the id to the form values
  const newUser = await ftUserService.create(formattedValues);// TODO: catch error

  if (newUser) {
    const sessionToken = await ftSessionService.setSessionToken(newUser);
    const currentSession = await ftSessionService.getSessionObject(['id', 'email', 'first_name', 'last_name', 'gender']);
    return { ...currentSession, type: 'user', token: sessionToken };
  }
  return null;
}

const processLogin = async (p_req: Request): Promise<DSessionUser | null> => {
  const ftAuthService = new FTAuthService();
  const verifiedUser = await ftAuthService.verifyUser(p_req.body)
    .catch(e => {
      console.log('Error checking user'); //TODO: notify, and proper logging
    });

  if (verifiedUser) {
    const ftSessionService = new FTSessionService(p_req.body.sessionToken);
    const sessionToken = await ftSessionService.setSessionToken(verifiedUser);
    const currentSession = await ftSessionService.getSessionObject(['id', 'email', 'first_name', 'last_name', 'gender']);

    return { ...currentSession, type: 'user', token: sessionToken };
  } else {
    return null;
  }
}