import { Router, Request, Response, NextFunction } from "express";
import dayjs from 'dayjs';
import FTSessionMiddleware from "../middleware-classes/session/session.middleware";
import FTAuthMiddleware from "../middleware-classes/auth/auth.middleware";
import { UserMiddleware } from "../middleware-classes/user/user.middleware";
import logger from "../utils/logger";
import { DEndpointResponse, DHelperResponse } from "./definitions";
import AuthController from "../controllers/auth/AuthController";


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
      console.log('error', e);
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