import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    console.log('CURRENT IP: ');
    next()
})

// TODO: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.get('/families', (req: Request, res: Response) /**TODO: return type */ => {
    // TODO: sql select with cursor or resourceLimits. 
    return {}
});

export default router;