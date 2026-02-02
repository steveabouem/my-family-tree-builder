import { Router, Request, Response } from "express";
import { getUserById } from "../services/user";
import { sendRouteHandlerResponse } from "./helpers";
import { authCheck } from "./middlewares";

const router = Router();

router.get('/:id', authCheck, (req: Request<{id: string}, {}, {}, {}>, res: Response) => {
  const userId = Number(req.params.id);
  sendRouteHandlerResponse<number, any | null>(userId, getUserById, res, 'Get user');
});

export default router;