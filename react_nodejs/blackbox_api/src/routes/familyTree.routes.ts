import { Router, Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import FamilyTree from "../models/FamilyTree";
import { APIFamilyTreeDAO, APIGetFamilyTreeResponse, CreateTreeRequestPayload } from "../services/types";
import { sendRouteHandlerResponse } from "./helpers";
import { createTree, deleteTree, getAllTrees, getTreeById } from "../services/familyTree";

const router = Router();

router.get('/index', (req: Request<{}, {}, {}, { member: string }>, res: Response) => {
  sendRouteHandlerResponse<string, FamilyTree[] | null>(req.query.member, getAllTrees, res, 'Register');
});


router.get('/details', (req: Request<{}, {}, {}, { id: string }>, res: Response) => {
  sendRouteHandlerResponse<string, FamilyTree | null>(req.query.id, getTreeById, res, 'Get tree details');
});

router.post('/create', (req: Request<{},{}, CreateTreeRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<CreateTreeRequestPayload, APIGetFamilyTreeResponse   | null>(req.body, createTree, res, 'Create family tree');
});

router.post('/delete', (req: Request<{id: string}, {}, {}, {} >, res: Response) => {
  const treeId = parseInt(req.params.id);
  sendRouteHandlerResponse<number, null>(treeId, deleteTree, res, 'Delete tree');
});

// router.get('/members', (req: Request, res: Response) => {
//   const familyTreeController = new FamilyTreeController();
//   const helper = new RequestHelper(req, res);
//   helper.sendResponseFromControllerMethod(familyTreeController.getMembers, 'Get tree members');
// });

// router.put('/members', (req: Request, res: Response) => {
//   const familyTreeController = new FamilyTreeController();
//   const helper = new RequestHelper(req, res);

//   helper.sendResponseFromControllerMethod(familyTreeController.update, 'Update tree records');
// });

export default router;