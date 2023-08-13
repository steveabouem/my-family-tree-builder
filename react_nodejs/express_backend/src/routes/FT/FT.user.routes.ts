import { Router, Request, Response, NextFunction } from "express";
import FTSessionService from "../../services/FT/session/FT.session.service";
import FTAuthService from "../../services/FT/auth/FT.auth.service";
import { FTUserService } from "../../services/FT/user/FT.user.service";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const authService = new FTAuthService();
  // const sessionService = new FTSessionService();

  authService.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(400);
        res.json('IP is not approved');
      }
    })
    .catch(e => {
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
  const ftUserService = new FTUserService;
  ftUserService.getUserData(id)
    .then((user: any) => {
      console.log('DONE');
      res.json(user);
    })
    .catch(e => { //TODO: logging and error handling
      console.log('ERRORRRR: ', e);

      res.status(500);
      res.json('failed');
    });
});

router.get('/:id/families', (req: Request, res: Response) => {
  const ftUserService = new FTUserService;

  ftUserService.getRelatedFamilies(parseInt(req.params.id))
    .then((fams: any) => {
      console.log('DONE');
      res.json({ "relatedFamilies": fams });
    })
    .catch(e => { //TODO: logging and error handling
      console.log('ERRORRRR: ', e);

      res.status(500);
      res.json('failed');
    });
});

router.get('/:id/extended-families', (req: Request, res: Response) => {
  const ftUserService = new FTUserService;

  ftUserService.getExtendedFamiliesDetails(parseInt(req.params.id))
    .then((fams: any) => {
      console.log('DONE');
      res.json({ "relatedFamilies": fams });
    })
    .catch(e => { //TODO: logging and error handling
      console.log('ERRORRRR: ', e);

      res.status(500);
      res.json('failed');
    });
});


export default router;