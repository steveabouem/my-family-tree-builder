import { Router, Request, Response, NextFunction } from "express";
import FTAuthMiddleware from "../middleware-classes/auth/auth.middleware";
import logger from "../utils/logger";
import AuthController from "../controllers/auth/AuthController";
import { DEndpointResponse, DRequestPayload } from "../controllers/controllers.definitions";
import { DUserDTO } from "../middleware-classes/user/user..definitions";
import { DRegistrationResponse } from "../controllers/auth/auth.definitions";


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
      logger.error('Unable to use auth middleware ', e);
      res.status(400);
      res.json({ ipIsValid: false, message: e });
    });

  next();
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  const authController = new AuthController();
  authController.register(req, res);
});

router.post('/login', (req: Request, res: Response) => {
  const authController = new AuthController();
  authController.login(req, res);
});

router.post('/logout', (req: Request, res: Response) => {
  const authController = new AuthController();
  authController.logout(req, res);
});

export default router;