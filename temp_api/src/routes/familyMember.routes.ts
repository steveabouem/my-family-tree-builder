import { Request, Response, Router } from "express";
import { authCheck } from "./middlewares";
import { getSessionUser, sendRouteHandlerResponse } from "./helpers";
import { getMemberByNodeId } from "../services/familyMember";

const router = Router();

router.get(
  "/:id",
  authCheck,
  (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    const id = parseInt(req.params.id);
    const sessionUser = getSessionUser(req);
    const userId = sessionUser?.userId;

    sendRouteHandlerResponse<{ memberId: number; userId?: number }, any>(
      { memberId: id, userId },
      getMemberByNodeId,
      res,
      "getMember",
      req
    );
  }
);

export default router;