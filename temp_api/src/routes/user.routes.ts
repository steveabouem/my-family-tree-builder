import { Router, Request, Response, NextFunction } from "express";
import { getProfileDetailsByUserId } from "../services/user";
import { sendRouteHandlerResponse } from "./helpers";
import { authCheck } from "./middlewares";

const router = Router();

router.get('/:id', authCheck, (req: Request<{id: string}, {}, {}, {}>, res: Response, next: NextFunction) => {
  const userId = Number(req.params.id);
  sendRouteHandlerResponse<number, any | null>(userId, getProfileDetailsByUserId, res, 'Get user', req);
});

export default router;