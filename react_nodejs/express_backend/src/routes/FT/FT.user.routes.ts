import { Router, Request, Response, NextFunction } from "express";
import FTAuthService from "../../services/FT/auth/auth.service";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    next();
});

router.get('/index', (req: Request, res: Response) => {
    console.log('YO');

    res.send('TEST');
});

export default router;