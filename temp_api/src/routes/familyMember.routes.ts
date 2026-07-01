import { Request, Response, Router } from "express";
import { authCheck } from "./middlewares";
import { getSessionUser, sendRouteHandlerResponse } from "./routeHelpers";
import { getBloodline, getMemberById } from "../services/familyMember";
import { GetMemberBloodlineResponse, GetMemberResponse } from "../services/types";
import { Relationship } from "@/models";

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

router.get('/:id/bloodline', authCheck, (req: Request<{id: string},{},{},{}>, res: Response) => {
   const currentUSer = getSessionUser(req) || { userId: 1 };
   const memberId = Number(req.params.id);
   sendRouteHandlerResponse<number, GetMemberBloodlineResponse>(memberId, getBloodline, res, 'getBloodline')
});

export default router;