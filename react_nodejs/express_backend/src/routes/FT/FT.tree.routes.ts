import { Router, Request, Response, NextFunction } from "express";
import FTFam from "../../models/FT.family";
import FTTree from "../../models/FT.tree.";
import FTAuthService from "../../services/FT/auth/FT.auth.service";
import { FTTreeService } from "../../services/FT/tree/FT.tree.service";

const router = Router();

router.use((p_req: Request, p_res: Response, p_next: NextFunction) => {
    const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
    const authService = new FTAuthService();

    authService.verifyIp(ip)
        .then((valid: boolean) => {
            if (!valid) {
                p_res.status(400);
                p_res.json('IP is not approved');
            }
        })
        .catch(e => {
            // TODO: catch return false doesnt actually catch falty logic, 
            // just wrong syntax and maybe wrong typing. FIX
            p_res.status(400);
            p_res.json('Error: ' + e);
        });

    p_next()
})

router.post('/create', (p_req: Request, p_res: Response) => {
    const ftTreeService = new FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.create(p_req.body)
        .then((success: boolean) => {
            if (success) {
                p_res.status(201);
                p_res.json(true);
            } else {
                p_res.status(400);
                p_res.json(false);
            }
        })
        .catch(e => {
            console.log('ERROR: ', e);
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            p_res.status(500);
            p_res.json(e);
        });
});

router.get('/:id', (p_req: Request, p_res: Response) => {
    const ftTreeService = new FTTreeService;

    ftTreeService.getTree(parseInt(p_req.params.id))
        .then((r: FTTree | null) => {
            p_res.status(200);
            p_res.json(r);
        })
        .catch(e => {
            p_res.status(500);
            p_res.json(e);
        });
});

router.get('/:id/families', (p_req: Request, p_res: Response) => {
    const ftTreeService = new FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.getFamilies(parseInt(p_req.params.id))
        .then((families: number[] | undefined) => {
            if (families) {
                p_res.status(201);
                p_res.json(families);
            } else {
                p_res.status(400);
                p_res.json(null);
            }
        })
        .catch(e => {
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            p_res.status(500);
            p_res.json(e);
        });
});

router.put('/:id', (p_req: Request, p_res: Response) => {
    const ftTreeService = new FTTreeService;
    const values = { ...p_req.body };

    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.update(values, parseInt(p_req.params.id))
        .then((success: boolean) => {
            if (success) {
                p_res.status(201);
                p_res.json(success);
            } else {
                p_res.status(400);
                p_res.json(null);
            }
        })
        .catch(e => {
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            p_res.status(500);
            p_res.json(e);
        });
});

router.put('/:id/families', (p_req: Request, p_res: Response) => {
    const ftTreeService = new FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.addFamily(parseInt(p_req.params.id), p_req.body.id)
        .then((success: boolean) => {
            if (success) {
                p_res.status(201);
                p_res.json(success);
            } else {
                p_res.status(400);
                p_res.json(null);
            }
        })
        .catch(e => {
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            p_res.status(500);
            p_res.json(e);
        });
});

router.put('/:id/families/remove', (p_req: Request, p_res: Response) => {
    const ftTreeService = new FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.removeFamily(parseInt(p_req.params.id), p_req.body.id)
        .then((success: boolean) => {
            if (success) {
                p_res.status(201);
                p_res.json(success);
            } else {
                p_res.status(400);
                p_res.json(null);
            }
        })
        .catch(e => {
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            p_res.status(500);
            p_res.json(e);
        });
});

export default router;