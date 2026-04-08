import { Request, Response, Router } from "express";
import { authCheck } from "./middlewares";
import { getSessionUser, sendRouteHandlerResponse } from "./helpers";
import { getMemberById } from "../services/familyMember";
import { GetMemberResponse } from "../services/types";

const router = Router();

router.get(
  "/:id",
  authCheck,
  (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    const id = parseInt(req.params.id);
    const sessionUser = getSessionUser(req);
    const userId = sessionUser?.userId || 0;

    sendRouteHandlerResponse<{ id: number; requester: number }, GetMemberResponse>(
      { id, requester: userId },
      getMemberById,
      res,
      "getMember",
      req
    );
  }
);

export default router;