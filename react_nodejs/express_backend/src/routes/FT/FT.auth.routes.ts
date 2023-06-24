import { Router, Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
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
      } else {
        p_res.json({ session: { ipIsValid: true, ip } });
      }
    })
    .catch(e => {
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      p_res.status(400);
      p_res.json({ session: null, message: 'Error: ' + e });
    });


  p_next();
});

// TODO: typing of req body for p_
router.post('/register', (p_req: Request, p_res: Response) => {
  const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
  const ftUserService = new FTUserService();
  const formattedValues = { ...p_req.body, assigned_ips: [ip], created_at: new Date };

  processRegister(p_req)
    .then((session: DSessionUser | null) => {
      p_res.status(200);
      p_res.json({ session });
    })

  ftUserService.create(formattedValues)
    .then((p_user: Partial<DFTUserDTO> | null) => {
      p_res.status(201);
      p_res.json(p_user);
    }).catch(e => {
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      p_res.status(400);
      p_res.json('Error: ' + e);
    }); // TODO: handle redirect in client
});

// TODO: req, res typing
router.post('/login', (p_req: Request, p_res: Response) => {
  const authService = new FTAuthService();
  console.log('SESSION STUFF', decodeURIComponent(p_req.cookies.FT.session));


  authService.verifyUser(p_req.body)
    .then((p_user: Partial<DFTUserDTO> | null) => {
      if (p_user) {
        p_res.status(200);
      } else {
        p_res.status(400);
      }
      p_res.json({ user: p_user, type: 'user' });
    });
});

router.get('/logout', (p_req: Request, p_res: Response) => {
  // TODO: do I need to reinitialize anything here?
});

export default router;

// HELPERS
const processRegister = async (p_req: Request): Promise<DSessionUser | null> => {
  const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
  const ftUserService = new FTUserService();
  const ftSessionService = new FTSessionService(p_req.cookies.FT);
  const formattedValues = { ...p_req.body, assigned_ips: [ip], created_at: new Date };
  // TODO: use ftuser service to match spouse's first and last name and return id here.
  // in the front, it will be some sort of dd that will use the ServiceWorker, and add the id to the form values
  const newUSer = await ftUserService.create(formattedValues);// TODO: catch error

  if (newUSer) {
    const sessionToken = await ftSessionService.setSessionToken(newUSer);
    const currentSession = await ftSessionService.getSessionObject(['id', 'email', 'first_name', 'last_name', 'gender']);
    return { ...currentSession, type: 'user', token: sessionToken || '' };
  } else {
    return null;
  }
}

const processLogin = async (p_req: Request): Promise<DSessionUser | null> => {

  const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
  const ftUserService = new FTUserService();
  const ftSessionService = new FTSessionService(p_req.cookies.FT);
  const currentUser = await ftUserService.getById(p_req.cookies.FT.session.id);

  if (currentUser) {
    const sessionToken = await ftSessionService.setSessionToken(currentUser);
    const currentSession = await ftSessionService.getSessionObject(['id', 'email', 'first_name', 'last_name', 'gender']);
    return { ...currentSession, type: 'user', token: sessionToken || '' };
  } else {
    return null;
  }
}