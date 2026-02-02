import { Router, Request, Response } from "express";

import { updateUser, login, register } from "../services/auth";
import { getUserById } from "../services/user";
import { sendRouteHandlerResponse } from "./helpers";
import { APIAuthenticationResponse, LoginRequestPayload, UpdateUserRequestPayload } from "../services/types"

const router = Router();

router.post('/register', (req: Request, res: Response) => {
  sendRouteHandlerResponse<any, APIAuthenticationResponse | null>(req.body, register, res, 'Register', req);
});

router.get('/:id', (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
  const id = parseInt(req.params.id);
  sendRouteHandlerResponse<number, APIAuthenticationResponse | null>(id, getUserById, res, 'Get user');
});

router.post('/login', (req: Request<{}, {}, LoginRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<LoginRequestPayload, APIAuthenticationResponse>(req.body, login, res, 'Login', req);
});

router.post('/logout', (req: Request<{}, {}, {}, {}>, res: Response, next: any) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to destroy session" });
      }

      res.clearCookie(process.env.COOKIE_NAME as string, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      return res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (e: unknown) {
    res.status(500);
    res.json('failed');
  }
});

router.post('/user/:id', (req: Request<{ id: string }, {}, UpdateUserRequestPayload, {}>, res: Response) => {
  const userId = parseInt(req.params.id);
  sendRouteHandlerResponse<UpdateUserRequestPayload, APIAuthenticationResponse>({ ...req.body, userId }, updateUser, res, 'update user');
});

export default router;