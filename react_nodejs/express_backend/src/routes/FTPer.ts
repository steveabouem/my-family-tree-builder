import { Router, Request, Response, NextFunction } from "express";

const femailyMemberRoutes = Router();

femailyMemberRoutes.use((req: Request, res: Response, next: NextFunction) => {
    console.log('CURRENT IP: ');
    next()
})

femailyMemberRoutes.get('/', (req: Request, res: Response) => {

});

export default femailyMemberRoutes;