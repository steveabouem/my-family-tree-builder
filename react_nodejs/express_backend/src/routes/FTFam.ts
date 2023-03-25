import { Router, Request, Response, NextFunction } from "express";
import { resourceLimits } from "worker_threads";
// TODO: I need /family as a prefix
const familyRoutes = Router();

familyRoutes.use((req: Request, res: Response, next: NextFunction) => {
    console.log('CURRENT IP: ');
    next()
})

// TODO: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
familyRoutes.get('/families', (req: Request, res: Response) /**TODO: return type */ => {
    // TODO: sql select with cursor or resourceLimits. 
    return {}
});

export default familyRoutes;