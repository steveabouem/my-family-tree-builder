import { Router, Request, Response, NextFunction } from "express";
import FTAuthMiddleware from "../middleware-classes/auth/auth.middleware";
import FamilyTreeController from "../controllers/familyTree/FamilyTreeController";
import logger from "../utils/logger";
import FamilyTree from "../models/FamilyTree";
import { DEndpointResponse, DRequestPayload } from "../controllers/controllers.definitions";
import RequestHelper from "./RequestHelper";

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

// ! -TOFIX: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.get('/index', (req: Request, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);
  helper.sendResponseFromControllerMethod(familyTreeController.getAll, 'Get trees index');
});

router.get('/details', (req: Request, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  familyTreeController.getOne(req, res);
});

router.post('/create', (req: Request, res: Response) /**TODO: return type */ => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);
  helper.sendResponseFromControllerMethod(familyTreeController.create, 'Create family tree');
});

router.post('/delete', (req: Request, res: Response) /**TODO: return type */ => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);
  helper.sendResponseFromControllerMethod(familyTreeController.delete, 'Delete tree');
});

router.get('/members', (req: Request, res: Response) /**TODO: return type */ => {
  const familyTreeController = new FamilyTreeController();
  const helper = new RequestHelper(req, res);
  helper.sendResponseFromControllerMethod(familyTreeController.getMembers, 'Get tree members');
});

router.put('/members', (req: Request, res: Response) /**TODO: return type */ => {
  const familyTreeController = new FamilyTreeController();
  familyTreeController.addFamilyUnit(req, res);
});

router.get('/layouts', (req: Request, res: Response) /**TODO: return type */ => {
  const familyTreeController = new FamilyTreeController();
  familyTreeController.getTreeLayout(req, res);
});

router.get('/narration-fields', (req: Request, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  familyTreeController.getTreeLayout(req, res);
});

export default router;