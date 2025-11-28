import { Router, Request, Response } from "express";

import FamilyTree from "../models/FamilyTree";
import { FamilyTreeFormData, APIGetFamilyTreeResponse, ManageTreeRequestPayload, FamilyMemberData } from "../services/types";
import { sendRouteHandlerResponse } from "./helpers";
import { createTree, deleteTree, getAllRelativesData, getAllTrees, getTreeById, updateTree } from "../services/familyTree";

const router = Router();

router.get('/index', (req: Request<{}, {}, {}, { user: string }>, res: Response) => {
  sendRouteHandlerResponse<string, FamilyTree[] | null>(req.query.user, getAllTrees, res, 'Get all trees');
});

router.get('/details', (req: Request<{}, {}, {}, { id: string }>, res: Response) => {
  sendRouteHandlerResponse<string, FamilyTree | null>(req.query.id, getTreeById, res, 'Get tree details');
});

router.post('/create', (req: Request<{}, {}, ManageTreeRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<ManageTreeRequestPayload, APIGetFamilyTreeResponse | null>(req.body, createTree, res, 'Create family tree');
});

router.post('/delete', (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
  const treeId = parseInt(req.params.id);
  sendRouteHandlerResponse<number, null>(treeId, deleteTree, res, 'Delete tree');
});

// router.get('/members', (req: Request<{ }, {}, {}, {id: string}>, res: Response) => {
//   const treeId = parseInt(req.query.id);
//   sendRouteHandlerResponse<number, FamilyMemberData[] | null>(treeId, getAllRelativesData, res, 'Get members');
// });

router.put('/members', (req: Request<{}, {}, ManageTreeRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<ManageTreeRequestPayload, APIGetFamilyTreeResponse | null>(req.body, updateTree, res, 'Update family tree');
});

export default router;