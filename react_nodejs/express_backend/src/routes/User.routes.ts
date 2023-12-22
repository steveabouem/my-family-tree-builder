import { Router, Request, Response, NextFunction } from "express";
import UserController from "../controllers/tracker/User/User.controller";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    next();
})

router.get('/index', (req: Request, res: Response) => {
    const userController = new UserController();
    // TODO: typing of returned json for line 11 and the result below
    userController.getList(undefined, undefined, undefined, 20).then((result: any) => {
        res.json(result[0]);
    })
        .catch(() => res.status(400).send());
});

router.post('/create', (req: Request, res: Response) => {
    const userController = new UserController();
    const ip = '';
    const newUserFieldValues = { ...req.body, authorizedIps: [ip], roles: '[1]' };
    res.send('ok');
    // userController.create(newUserFieldValues)
    //     .then((r: boolean) => {
    //         res.json(r);
    //     })
    //     .catch(() => {
    //         res.status(400).send();
    //     });
});

export default router;  