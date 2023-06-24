import { Router, Request, Response, NextFunction } from "express";
import * as dotenv from 'dotenv';
import FTSessionService from "../../services/FT/session/FT.session.service";
import FTAuthService from "../../services/FT/auth/FT.auth.service";
import { FTUserService } from "../../services/FT/user/FT.user.service";

const router = Router();
dotenv.config();

router.use((p_req: Request, p_res: Response, p_next: NextFunction) => {
  const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
  const authService = new FTAuthService();
  const sessionService = new FTSessionService(p_req.cookies.FT);

  authService.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        p_res.status(400);
        p_res.json('IP is not approved');
      }
    })
    .catch(e => {
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      p_res.status(500);
      p_res.json('Error: ' + e);
    });

  p_next();
});

router.get('/:id', (p_req: Request, p_res: Response) => {
  const id = parseInt(p_req.params.id);
  // Not sure what to do with this yet
  const ftUserService = new FTUserService;
  ftUserService.getUserData(id)
    .then((user: any) => {
      console.log('DONE');
      p_res.json(user);
    })
    .catch(e => { //TODO: logging and error handling
      console.log('ERRORRRR: ', e);

      p_res.status(500);
      p_res.json('failed');
    });
});

router.get('/:id/families', (p_req: Request, p_res: Response) => {
  const ftUserService = new FTUserService;

  ftUserService.getRelatedFamilies(parseInt(p_req.params.id))
    .then((fams: any) => {
      console.log('DONE');
      p_res.json({ "relatedFamilies": fams });
    })
    .catch(e => { //TODO: logging and error handling
      console.log('ERRORRRR: ', e);

      p_res.status(500);
      p_res.json('failed');
    });
});

router.get('/:id/extended-families', (p_req: Request, p_res: Response) => {
  const ftUserService = new FTUserService;

  ftUserService.getExtendedFamiliesDetails(parseInt(p_req.params.id))
    .then((fams: any) => {
      console.log('DONE');
      p_res.json({ "relatedFamilies": fams });
    })
    .catch(e => { //TODO: logging and error handling
      console.log('ERRORRRR: ', e);

      p_res.status(500);
      p_res.json('failed');
    });
});


export default router;