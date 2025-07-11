import { Op } from "sequelize";
import { Router, Request, Response } from "express";
import logger from "../utils/logger";
import { APIRegistrationResponse, PasswordChangeData, ServiceResponseWithPayload } from "../services/types";
import User from "../models/User";
import { changePassword, login, logout, register } from "../services/auth";
import { getUserById } from "../services/user";

const router = Router();

router.post('/register', (req: Request, res: Response) => {
  register(req.body)
    .then((data: ServiceResponseWithPayload<APIRegistrationResponse | null>) => {
      res.status(data.code);
      res.json(data)
    })
    .catch((e: unknown) => {
      res.json('fail');
    });
});

router.get('/:id', (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    getUserById(id)
      .then((data: any) => {
        res.status(data.code);
        res.json(data);
      });
  } catch (e) {
    res.json('fail');
  }
});

router.post('/login', (req: Request<{}, {}, { email: string, password: string }, {}>, res: Response) => {
  login(req.body)
    .then((data) => {
      res.status(data.code);
      res.json(data);
    });
});

router.post('/logout', (req: Request<{}, {}, {}, {}>, res: Response) => {
  logout()
    .then((data) => {
      res.status(data.code);
      res.json(data);
    });
});

router.post('/password/change', (req: Request<{}, {}, PasswordChangeData, {}>, res: Response) => {
  changePassword(req.body)
    .then((data) => {
      res.status(data.code);
      res.json(data);
    });
});

export default router;