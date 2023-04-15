import { Router, Request, Response, NextFunction } from "express";
import { DFTRegistrationFields } from "../../services/FT/auth/auth.definitions";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    next();
});

router.post('/register', (req: Request, res: Response) => {


});


export default router;  