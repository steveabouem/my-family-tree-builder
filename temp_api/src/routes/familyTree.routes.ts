import { Router, Request, Response } from "express";
import FamilyTree from "../models/FamilyTree";
import { APIFamilyTreeDAO, APIGetFamilyTreeResponse, ManageTreeRequestPayload } from "../services/types";
import { sendRouteHandlerResponse } from "./helpers";
import { createTree, deleteTree, getAllTrees, getTreeById, updateTree } from "../services/familyTree";

const router = Router();

router.get('/index', (req: Request<{}, {}, {}, { member: string }>, res: Response) => {
  sendRouteHandlerResponse<string, FamilyTree[] | null>(req.query.member, getAllTrees, res, 'Get all trees');
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

router.get('/members', (req: Request, res: Response) => {
  const treeId = parseInt(req.params.id);
  sendRouteHandlerResponse<number, null>(treeId, deleteTree, res, 'Delete tree');
});

router.put('/members', (req: Request<{}, {}, ManageTreeRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<ManageTreeRequestPayload, APIGetFamilyTreeResponse | null>(req.body, updateTree, res, 'Update family tree');
});

export default router;