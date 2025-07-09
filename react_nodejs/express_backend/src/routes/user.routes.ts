import { Router, Request, Response, NextFunction } from "express";
import winston from "winston";
import AuthMiddleware from "../middleware-classes/auth/auth.middleware";
import logger from "../utils/logger";
import { getUserById } from "@v2/services/user";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const authMiddleware = new AuthMiddleware();
  // const sessionMiddleware = new FTSessionMiddleware();

  authMiddleware.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(400);
        res.json('IP is not approved');
      }
    })
    .catch((e: unknown) => {
      // ! -TOFIX: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      res.status(500);
      res.json('Error: ' + e);
    });

  next();
});

// router.get('/:id', (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   getUserById(id)
//     .then((user: any) => {
//       console.log('DONE');
//       res.json(user);
//     })
//     .catch((e: unknown) => {
//       logger.error('error', e);
//       console.log('ERRORRRR: ', e);

//       res.status(500);
//       res.json('failed');
//     });
// });

// router.get('/:id/families', (req: Request, res: Response) => {
//   userService.getRelatedFamilies(parseInt(req.params.id))
//     .then((fams: any) => {
//       console.log('DONE');
//       res.json({ "relatedFamilies": fams });
//     })
//     .catch((e: unknown) => {
//       winston.log('error', e); //TODO: logging and error handling
//       console.log('ERRORRRR: ', e);

//       res.status(500);
//       res.json('failed');
//     });
// });

// router.get('/:id/extended-families', (req: Request, res: Response) => {
//   userService.getExtendedFamiliesDetails(parseInt(req.params.id))
//     .then((fams: any) => {
//       console.log('DONE');
//       res.json({ "relatedFamilies": fams });
//     })
//     .catch((e: unknown) => {
//       winston.log('error', e); //TODO: logging and error handling
//       console.log('ERRORRRR: ', e);

//       res.status(500);
//       res.json('failed');
//     });
// });

export default router;