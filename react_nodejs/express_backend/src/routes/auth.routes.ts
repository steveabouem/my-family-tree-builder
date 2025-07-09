import { Router, Request, Response, NextFunction } from "express";
import AuthMiddleware from "../middleware-classes/auth/auth.middleware";
import logger from "../utils/logger";
import RequestHelper from "./RequestHelper";
import AuthController from "../controllers/auth/AuthController";
import { APIRegistrationResponse } from "../controllers/auth/auth.definitions";
import { APIRequestPayload } from "../controllers/controllers.definitions";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const authMiddleware = new AuthMiddleware();
  authMiddleware.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(400);
        res.json({ ipIsValid: false });
        return; // Early return to prevent further processing
      }
      next(); // Only call next() if IP is valid
    })
    .catch((e: unknown) => {
      logger.error('Unable to use auth middleware ', e);
      res.status(400);
      res.json({ ipIsValid: false, message: e });
      return; // Early return to prevent further processing
    });
});

router.post('/register', (req: Request, res: Response) => {
  try {
    const authController = new AuthController;
    authController.register(req.body)
    .then((data: any) => {
        res.status(data.code);
        res.json(data)
      })

  } catch(e) {
    logger.error(e);
    res.json('fail')
  }
   
});
// router.get('/:id', (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   // Not sure what to do with this yet
//   const userController = new UserController;
//   userController.getUserData(id)
//     .then((user: any) => {
//       console.log('DONE');
//       res.json(user);
//     })
//     .catch((e: unknown) => {
//       winston.log('error', e); //TODO: logging and error handling
//       console.log('ERRORRRR: ', e);

//       res.status(500);
//       res.json('failed');
//     });
// });

// router.post('/login', (req: Request, res: Response) => {
//   const authController = new AuthController();
//   const helper = new RequestHelper(req, res);
//   // helper.sendResponseFromControllerMethod(authController.login, 'Login');
// });

// router.post('/logout', (req: Request, res: Response) => {
//   const authController = new AuthController();
//   const helper = new RequestHelper(req, res);
//   // helper.sendResponseFromControllerMethod(authController.logout, 'Logout');
// });

// router.post('/password/change', (req: Request, res: Response) => {
//   const authController = new AuthController();
//   const helper = new RequestHelper(req, res);
//   // helper.sendResponseFromControllerMethod(authController.changePassword, 'Update Pwd');
// });

export default router;