import { Router, Request, Response, NextFunction } from "express";
import UserController from "../../controllers/tracker/User/User.controller";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    next();
})

router.get('/index', (p_req: Request, p_res: Response) => {
    const userController = new UserController();
    // TODO: typing of returned json for line 11 and the result below
    userController.getList(undefined, undefined, undefined, 20).then((result: any) => {
        p_res.json(result[0]);
    })
        .catch(() => p_res.status(400).send());
});

router.post('/create', (p_req: Request, p_res: Response) => {
    const userController = new UserController();
    const ip = '';
    const newUserFieldValues = { ...p_req.body, authorizedIps: [ip], roles: '[1]' };
    p_res.send('ok');
    // userController.create(newUserFieldValues)
    //     .then((r: boolean) => {
    //         p_res.json(r);
    //     })
    //     .catch(() => {
    //         p_res.status(400).send();
    //     });
});

export default router;  