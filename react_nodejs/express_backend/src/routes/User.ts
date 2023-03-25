import { Router, Request, Response, NextFunction } from "express";
import { DUserDTO } from "../dtos/user.dto";

const userRoutes = Router();

userRoutes.use((req: Request, res: Response, next: NextFunction) => {
    console.log('CURRENT IP: ');
    next()
})

userRoutes.get('/users', (req: Request, res: Response) => {
    const incomingUser: DUserDTO = req.body;

});

export default userRoutes;