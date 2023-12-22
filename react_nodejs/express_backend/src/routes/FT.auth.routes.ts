import { Router, Request, Response, NextFunction } from "express";
import dayjs from 'dayjs';
import winston from "winston";
import { Session } from "express-session";
import FTSessionMiddleware from "../middleware-classes/session/FT.session.middleware";
import FTAuthMiddleware from "../middleware-classes/auth/FT.auth.middleware";
import { FTUserMiddleware } from "../middleware-classes/user/FT.user.middleware";


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
    .catch((e: unknown) => {
      winston.log('error', e);
      res.status(400);
      res.json({ ipIsValid: false, message: e });
    });
  next();
});

// TODO: typing of req body for 
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  processRegister(req, res, next)
    .then((sessionData: Session & Partial<Session> | void) => {
      if (sessionData) {
        req.session = sessionData;
        res.set('Set-Cookie', `${sessionData.cookie}`);
        res.set('httpOnly', 'true');
        res.status(200);
        res.json({ session: sessionData.id });
      } else {
        res.status(400);
        // TODO: standardise error return to client ({status, message} maybe?)
        res.json({ message: 'Unable to create session.' });
      }
    })
    .catch((e: unknown) => {
      winston.log('error', 'Registration: ' + e);
      console.log('Register Error: ', e);
    });
});

// TODO: req, res typing
router.post('/login', (req: Request, res: Response) => {
  // processLogin(req)
  //   .then((sessionData: DSessionUser | null) => {
  //     res.set('Set-Cookie', `${sessionData?.token}`);
  //     res.set('httpOnly', 'true');
  //     res.status(200);
  //     res.json({ session: sessionData });
  //   });
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
const processRegister = async (req: Request, res: Response, next: NextFunction): Promise<Session & Partial<Session> | void> => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ftUserMiddleware = new FTUserMiddleware();
  const ftSessionMiddleware = new FTSessionMiddleware();
  const formattedValues = { ...req.body, assigned_ips: [ip], created_at: dayjs() };
  const expiration = dayjs().add(1, 'days').toDate();


  try {
    // TODO: use ftuser middleware to match spouse's first and last name and return id here.
    // in the front, it will be some sort of dd that will use the MiddlewareWorker, and add the id to the form values
    // This will go in the profile Selection, no need to crowd registration w it
    const duplicate = await ftUserMiddleware.getByEmail(req.body.email);
    if (duplicate) {
      throw new Error('Email address is already in use');
    }

    const newUser = await ftUserMiddleware.create(formattedValues);

    if (newUser) {
      // create session record and get id
      const newSession = await ftSessionMiddleware.createSession({
        id: newUser.id || 0,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
      }, next);

      if (newSession) {
        // @ts-ignore : need a way to not have to pass all the session methods. My typing is wrong
        return ({
          id: newSession.id.toString(),
          cookie: {
            originalMaxAge: 86400000,
            expires: expiration,
          },
        });
      }
    } else {
      res.status(400);
      res.json({ message: 'No user was created.' });
    }
  } catch (e: unknown) {
    winston.log('error', 'processRegister: ' + e);
  }
}

// const processLogin = async (req: Request): Promise<DSessionUser | null> => {
//   const ftAuthMiddleware = new FTAuthMiddleware();
//   const verifiedUser = await ftAuthMiddleware.verifyUser(req.body)
//     .catch((e: unknown) => {
//       winston.log('error', e);
//       console.log('Error checking user'); //TODO: notify, and proper logging
//     });

//   if (verifiedUser) {
//     console.log('User was verified succesfuly');

//     const ftSessionMiddleware = new FTSessionMiddleware();
//     const sessionToken = await ftSessionMiddleware.createSession(verifiedUser);
//     console.log('GOT TOKEN ', sessionToken);
//     const currentSession = await ftSessionMiddleware.getSessionData(sessionToken || '', ['id', 'email', 'first_name', 'last_name', 'gender']);

//     return { ...currentSession, id: 1, type: 'user', token: sessionToken };
//   } else {
//     return null;
//   }
// }