import { Router, Request, Response, NextFunction } from "express";
import winston from "winston";
import FTAuthMiddleware from "../middleware-classes/auth/auth.middleware";
import FamilyTreeController from "../controllers/familyTree/FamilyTreeController";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ftAuthMiddleware = new FTAuthMiddleware();

  ftAuthMiddleware.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(400);
        res.json('IP is not approved');
      }
    })
    .catch((e: unknown) => {
    winston.log('error' ,  e);
      // ! -TOFIX: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      res.status(500);
      res.json('Error: ' + e);
    });

  next();
})

// ! -TOFIX: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.get('/index', (req: Request, res: Response) => {
  const familyTreeController = new FamilyTreeController();
  familyTreeController.getAll(req, res);
});

router.post('/create', (req: Request, res: Response) /**TODO: return type */ => {
 const familyTreeController = new FamilyTreeController();
 familyTreeController.create(req, res);
});

router.post('/delete', (req: Request, res: Response) /**TODO: return type */ => {
  const familyTreeController = new FamilyTreeController();
  familyTreeController.delete(req, res);
 });

 router.put('/members', (req: Request, res: Response) /**TODO: return type */ => {
  const familyTreeController = new FamilyTreeController();
  familyTreeController.addMembers(req, res);
 });
export default router;