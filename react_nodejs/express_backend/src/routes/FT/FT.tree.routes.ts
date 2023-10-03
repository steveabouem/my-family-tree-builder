import { Router, Request, Response, NextFunction } from "express";
import FTFam from "../../models/FT.family";
import FTTree from "../../models/FT.tree.";
import FTAuthMiddleware from "../../middleware-classes/FT/auth/FT.auth.middleware";
import { FTTreeMiddleware } from "../../middleware-classes/FT/tree/FT.tree.middleware";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const authMiddleware = new FTAuthMiddleware();

    authMiddleware.verifyIp(ip)
        .then((valid: boolean) => {
            if (!valid) {
                res.status(400);
                res.json('IP is not approved');
            }
        })
        .catch(e => {
            // TODO: catch return false doesnt actually catch falty logic, 
            // just wrong syntax and maybe wrong typing. FIX
            res.status(400);
            res.json('Error: ' + e);
        });

    next()
})

router.post('/create', (req: Request, res: Response) => {
    const ftTreeMiddleware = new FTTreeMiddleware;
    // TODO: there's definitely to add the create function to the base middleware instead
    ftTreeMiddleware.create(req.body)
        .then((success: boolean) => {
            if (success) {
                res.status(201);
                res.json(true);
            } else {
                res.status(400);
                res.json(false);
            }
        })
        .catch(e => {
            console.log('ERROR: ', e);
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            res.status(500);
            res.json(e);
        });
});

router.get('/:id', (req: Request, res: Response) => {
    const ftTreeMiddleware = new FTTreeMiddleware;

    ftTreeMiddleware.getTree(parseInt(req.params.id))
        .then((r: FTTree | null) => {
            res.status(200);
            res.json(r);
        })
        .catch(e => {
            res.status(500);
            res.json(e);
        });
});

router.get('/:id/families', (req: Request, res: Response) => {
    const ftTreeMiddleware = new FTTreeMiddleware;
    // TODO: there's definitely to add the create function to the base middleware instead
    ftTreeMiddleware.getFamilies(parseInt(req.params.id))
        .then((families: number[] | undefined) => {
            if (families) {
                res.status(201);
                res.json(families);
            } else {
                res.status(400);
                res.json(null);
            }
        })
        .catch(e => {
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            res.status(500);
            res.json(e);
        });
});

router.put('/:id', (req: Request, res: Response) => {
    const ftTreeMiddleware = new FTTreeMiddleware;
    const values = { ...req.body };

    // TODO: there's definitely to add the create function to the base middleware instead
    ftTreeMiddleware.update(values, parseInt(req.params.id))
        .then((success: boolean) => {
            if (success) {
                res.status(201);
                res.json(success);
            } else {
                res.status(400);
                res.json(null);
            }
        })
        .catch(e => {
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            res.status(500);
            res.json(e);
        });
});

router.put('/:id/families', (req: Request, res: Response) => {
    const ftTreeMiddleware = new FTTreeMiddleware;
    // TODO: there's definitely to add the create function to the base middleware instead
    ftTreeMiddleware.addFamily(parseInt(req.params.id), req.body.id)
        .then((success: boolean) => {
            if (success) {
                res.status(201);
                res.json(success);
            } else {
                res.status(400);
                res.json(null);
            }
        })
        .catch(e => {
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            res.status(500);
            res.json(e);
        });
});

router.put('/:id/families/remove', (req: Request, res: Response) => {
    const ftTreeMiddleware = new FTTreeMiddleware;
    // TODO: there's definitely to add the create function to the base middleware instead
    ftTreeMiddleware.removeFamily(parseInt(req.params.id), req.body.id)
        .then((success: boolean) => {
            if (success) {
                res.status(201);
                res.json(success);
            } else {
                res.status(400);
                res.json(null);
            }
        })
        .catch(e => {
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            res.status(500);
            res.json(e);
        });
});

export default router;