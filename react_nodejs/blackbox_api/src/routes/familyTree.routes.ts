import { Router, Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import FamilyTree from "../models/FamilyTree";
import { APIGetFamilyTreeResponse } from "../services/types";

const router = Router();

// router.get('/index', (req: Request, res: Response) => {
//   const familyTreeController = new FamilyTreeController();
//   const helper = new RequestHelper(req, res);
//   helper.sendResponseFromControllerMethod<FamilyTree[]>(familyTreeController.getAll, 'Get trees index');
// });

// router.get('/details', (req: Request<{}, {}, { id: string }, {}>, res: Response) => {
//   const familyTreeController = new FamilyTreeController();
//   const helper = new RequestHelper(req, res);
//   helper.sendResponseFromControllerMethod<FamilyTree | null>(familyTreeController.getOne, 'Get tree details');
// });

// router.post('/create', (req: Request, res: Response) => {
//   const familyTreeController = new FamilyTreeController();
//   const helper = new RequestHelper(req, res);
//   helper.sendResponseFromControllerMethod<APIGetFamilyTreeResponse | null>(familyTreeController.create, 'Create family tree');
// });

// router.post('/delete', (req: Request, res: Response) => {
//   const familyTreeController = new FamilyTreeController();
//   const helper = new RequestHelper(req, res);
//   helper.sendResponseFromControllerMethod(familyTreeController.delete, 'Delete tree');
// });

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