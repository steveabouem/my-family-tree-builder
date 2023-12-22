import { Router, Request, Response, NextFunction } from "express";
import winston from "winston";
import FTAuthMiddleware from "../middleware-classes/auth/FT.auth.middleware";
import { FTUserMiddleware } from "../middleware-classes/user/FT.user.middleware";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const authMiddleware = new FTAuthMiddleware();
  // const sessionMiddleware = new FTSessionMiddleware();

  authMiddleware.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(400);
        res.json('IP is not approved');
      }
    })
    .catch((e: unknown) => {
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      res.status(500);
      res.json('Error: ' + e);
    });

  next();
});

router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  // Not sure what to do with this yet
  const ftUserMiddleware = new FTUserMiddleware;
  ftUserMiddleware.getUserData(id)
    .then((user: any) => {
      console.log('DONE');
      res.json(user);
    })
    .catch((e: unknown) => {
      winston.log('error', e); //TODO: logging and error handling
      console.log('ERRORRRR: ', e);

      res.status(500);
      res.json('failed');
    });
});

router.get('/:id/families', (req: Request, res: Response) => {
  const ftUserMiddleware = new FTUserMiddleware;

  ftUserMiddleware.getRelatedFamilies(parseInt(req.params.id))
    .then((fams: any) => {
      console.log('DONE');
      res.json({ "relatedFamilies": fams });
    })
    .catch((e: unknown) => {
      winston.log('error', e); //TODO: logging and error handling
      console.log('ERRORRRR: ', e);

      res.status(500);
      res.json('failed');
    });
});

router.get('/:id/extended-families', (req: Request, res: Response) => {
  const ftUserMiddleware = new FTUserMiddleware;

  ftUserMiddleware.getExtendedFamiliesDetails(parseInt(req.params.id))
    .then((fams: any) => {
      console.log('DONE');
      res.json({ "relatedFamilies": fams });
    })
    .catch((e: unknown) => {
      winston.log('error', e); //TODO: logging and error handling
      console.log('ERRORRRR: ', e);

      res.status(500);
      res.json('failed');
    });
});


export default router;