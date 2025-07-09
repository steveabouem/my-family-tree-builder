import { Router, Request, Response, NextFunction } from "express";
import AuthMiddleware from "../middleware-classes/auth/auth.middleware";
import logger from "../utils/logger";
import { APILoginResponse, APILogoutResponse, APIRegistrationResponse } from "../controllers/auth/auth.definitions";
import { ServiceResponseWithPayload } from "../services/service.definitions";
import { register } from "../v2/services/auth";

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
    register(req.body)
      .then((data: ServiceResponseWithPayload<APIRegistrationResponse | null>) => {
        res.status(data.code);
        res.json(data)
      });

  } catch (e) {
    logger.error(e);
    res.json('fail')
  }
});

// router.get('/:id', (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
//   const id = parseInt(req.params.id);
//   userService.getUserById(id)
//     .then((data) => {
//       res.status(data.code);
//       res.json(data);
//     });
// });

// router.post('/login', (req: Request<{}, {}, { email: string, password: string }, {}>, res: Response) => {
//   authService.login(req.body)
//     .then((data) => {
//       res.status(data.code);
//       res.json(data);
//     });
// });

// router.post('/logout', (req: Request<{}, {}, {}, {}>, res: Response) => {
//   authService.logout()
//     .then((data) => {
//       res.status(data.code);
//       res.json(data);
//     });
// });

// router.post('/password/change', (req: Request<{}, {}, PasswordChangeData, {}>, res: Response) => {
//   authService.changePassword(req.body)
//     .then((data) => {
//       res.status(data.code);
//       res.json(data);
//     });
// });

export default router;