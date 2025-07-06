import { Router, Request, Response, NextFunction } from "express";
import FTAuthMiddleware from "../middleware-classes/auth/auth.middleware";
import FamilyTreeController from "../controllers/familyTree/FamilyTreeController";
import logger from "../utils/logger";
import RequestHelper from "./RequestHelper";
import FamilyTree from "../models/FamilyTree";
import { APIGetFamilyTreeResponse } from "../controllers/familyTree/familyTree.definitions";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ftAuthMiddleware = new FTAuthMiddleware();

  ftAuthMiddleware.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(403);
        res.json('Forbidden. IP is not approved');
      }
    })
    .catch((e: unknown) => {
      logger.error('! Family Tree middleware !', e);
      res.status(403);
      res.json('Unable to validate IP.');
    });


  next();
})

router.get('/index', (req: Request, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);
  helper.sendResponseFromControllerMethod<FamilyTree[]>(familyTreeController.getAll, 'Get trees index');
});

router.get('/details', (req: Request<{}, {}, { id: string }, {}>, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);
  helper.sendResponseFromControllerMethod<FamilyTree | null>(familyTreeController.getOne, 'Get tree details');
});

router.post('/create', (req: Request, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);
  helper.sendResponseFromControllerMethod<APIGetFamilyTreeResponse | null>(familyTreeController.create, 'Create family tree');
});

router.post('/delete', (req: Request, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);
  helper.sendResponseFromControllerMethod(familyTreeController.delete, 'Delete tree');
});

router.get('/members', (req: Request, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);
  helper.sendResponseFromControllerMethod(familyTreeController.getMembers, 'Get tree members');
});

router.put('/members', (req: Request, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);

  helper.sendResponseFromControllerMethod(familyTreeController.update, 'Update tree records');
});

export default router;