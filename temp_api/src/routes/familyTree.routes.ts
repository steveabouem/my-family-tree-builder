import { Router, Request, Response } from "express";
import FamilyTree from "../models/FamilyTree";
import { CreateTreeRequestV2, CreateTreeResponseV2 } from "../services/types";
import { getSessionUser, sendRouteHandlerResponse } from "./routeHelpers";
import { createTreeV2, deleteAll, deleteTree, getAllTrees, getTreeById} from "../services/familyTree";
import { authCheck } from "./middlewares";

const router = Router();

// router.get('/index', authCheck, (req: Request<{}, {}, {}, { user: string }>, res: Response) => {
//   sendRouteHandlerResponse<string, FamilyTree[] | null>(req.query.user, getAllTrees, res, 'Get all trees');
// });

router.get('/details', authCheck, (req: Request<{}, {}, {}, { id: string }>, res: Response) => {
  const treeId = Number(req.query.id);
  if (!Number.isFinite(treeId) || treeId <= 0) {
    res.status(400).json({ error: true, code: 400, message: 'Invalid tree id', payload: null });
    return;
  }
  sendRouteHandlerResponse<number, CreateTreeResponseV2 | null>(treeId, getTreeById, res, 'Get tree details');
});

// router.post('/create', authCheck, (req: Request<{}, {}, ManageTreeRequestPayload, {}>, res: Response) => {
//   sendRouteHandlerResponse<ManageTreeRequestPayload, APIGetFamilyTreeResponse | null>(req.body, createTree, res, 'Create family tree');
// });

router.post('/delete/:id', authCheck, (req: Request<{id: string}, {}, {}, {}>, res: Response) => {
   const currentUSer = getSessionUser(req) || { userId: 1 };
   const treeId = req.params.id;
   sendRouteHandlerResponse<{id: number, userId: number}, null>({id: Number(treeId), userId: currentUSer.userId, }, deleteTree, res, 'Delete tree');
});

/*
* V2
*/
router.get('/index', authCheck, (req: Request, res: Response) => {
   const currentUSer = getSessionUser(req) || { userId: 1 };
   sendRouteHandlerResponse<number, FamilyTree[] | null>(currentUSer.userId, getAllTrees, res, 'Get all trees');
});

router.post('/new', authCheck, (req, res) => {
   const currentUSer = getSessionUser(req) || { userId: 1 };
   sendRouteHandlerResponse<CreateTreeRequestV2, CreateTreeResponseV2 | null>({ ...req.body, created_by_id: currentUSer?.userId }, createTreeV2, res, 'New tree create flow')
});

router.post('/bulk-delete', authCheck, (req: Request<{}, {},{list: number[]},{}>, res) => {
   const currentUser = getSessionUser(req) || { userId: 1 };
   sendRouteHandlerResponse<{list: number[], requester: number}, null>({ list: req.body.list, requester: currentUser.userId }, deleteAll, res, 'New tree create flow')
});

export default router;