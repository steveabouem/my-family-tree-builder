import { Router, Request, Response, NextFunction } from "express";

const treeRoutes = Router();

treeRoutes.use((req: Request, res: Response, next: NextFunction) => {
    console.log('CURRENT IP: ');
    next()
})

treeRoutes.get('/', (req: Request, res: Response) => {

});

export default treeRoutes;