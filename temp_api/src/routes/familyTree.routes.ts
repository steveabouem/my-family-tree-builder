import { Router, Request, Response } from "express";

import FamilyTree from "../models/FamilyTree";
import { FamilyTreeFormData, APIGetFamilyTreeResponse, ManageTreeRequestPayload, FamilyMemberData, ManageMembersRequestPayload, DeleteMembersRequestPayload, DeleteTreeRequestPayload } from "../services/types";
import { sendRouteHandlerResponse } from "./helpers";
import { createTree, deleteTree, deleteTreeMember, getAllRelativesData, getAllTrees, getTreeById, updateMemberPositions, updateTree } from "../services/familyTree";

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

router.post('/delete', (req: Request<{ }, {}, DeleteTreeRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<DeleteTreeRequestPayload, null>(req.body, deleteTree, res, 'Delete tree');
});

// router.get('/members', (req: Request<{ }, {}, {}, {id: string}>, res: Response) => {
//   const treeId = parseInt(req.query.id);
//   sendRouteHandlerResponse<number, FamilyMemberData[] | null>(treeId, getAllRelativesData, res, 'Get members');
// });

router.put('/members', (req: Request<{}, {}, ManageTreeRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<ManageTreeRequestPayload, APIGetFamilyTreeResponse | null>(req.body, updateTree, res, 'Update family tree');
});

router.post('/members/remove', (req: Request<{}, {}, DeleteMembersRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<DeleteMembersRequestPayload, APIGetFamilyTreeResponse | null>(req.body, deleteTreeMember, res, 'Update family tree');
});

router.post('/members/positions', (req: Request<{}, {}, ManageMembersRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<ManageMembersRequestPayload, APIGetFamilyTreeResponse | null>(req.body, updateMemberPositions, res, 'Update family tree');
});

export default router;