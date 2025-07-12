import { Router } from "express";

const router = Router();

// // ! -TOFIX: override Request type with something more precise 
// // Ideally make a base route handlers class that will accept generics in request 
// // and return appropriate types...maybe generics as well ?
// router.get('/index', (req: Request, res: Response) => {
//   const familyMember = new FamilyMemberController();
//   return true;
// });

// router.post('/create', (req: Request, res: Response) /**TODO: return type */ => {
//   const familyMember = new FamilyMemberController();
//   return true;
// });

export default router;

