import { Router, Request, Response } from "express";
import { sendRouteHandlerResponse } from "./helpers";
import { APIGetSessionResponse } from "../services/types";
import { getCurrentSession } from "../services/session";

const router = Router();

router.get('/', (req: Request<{}, {}, {}, {id: string}>, res: Response) => {
  sendRouteHandlerResponse<string, APIGetSessionResponse>(req.query.id, getCurrentSession, res, 'Get Current Session');
});


export default router;