import { Router, Request, Response } from "express";

import { changePassword, login, register } from "../services/auth";
import { getUserById } from "../services/user";
import { sendRouteHandlerResponse } from "./helpers";
import { APILoginResponse, APIRegistrationResponse, LoginRequestPayload, PasswordChangeRequestPayload } from "../services/types"

const router = Router();

router.post('/register', (req: Request, res: Response) => {
  sendRouteHandlerResponse<any, APIRegistrationResponse | null>(req.body, register, res, 'Register', req);
});

router.get('/:id', (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
  const id = parseInt(req.params.id);
  sendRouteHandlerResponse<number, APIRegistrationResponse | null>(id, getUserById, res, 'Get user');
});

router.post('/login', (req: Request<{}, {}, LoginRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<LoginRequestPayload, APILoginResponse>(req.body, login, res, 'Login', req);
});

router.post('/logout', (req: Request<{}, {}, {}, {}>, res: Response) => {
  try {
    req.session.destroy((e: unknown) => {
      res.status(200);
      res.json('Bye!');
    });
  } catch(e: unknown) {
    res.status(500);
    res.json('failed');
  }
});

router.post('/password/change', (req: Request<{}, {}, PasswordChangeRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<PasswordChangeRequestPayload, APILoginResponse>(req.body, changePassword, res, 'Login');
});

export default router;