import { Router, Request, Response, NextFunction } from "express";
import FamilyTree from "../models/FamilyTree";
import winston from "winston";
import { TreeMiddleware } from "../middleware-classes/tree/familytree.middleware";
import FTAuthMiddleware from "../middleware-classes/auth/auth.middleware";

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
        .catch((e: unknown) => {
    winston.log('error' ,  e);
            // TODO: catch return false doesnt actually catch falty logic, 
            // just wrong syntax and maybe wrong typing. FIX
            res.status(400);
            res.json('Error: ' + e);
        });

    next()
})

router.post('/create', (req: Request, res: Response) => {
    const treeMiddleware = new TreeMiddleware;
    // TODO: there's definitely a way to add the create function to the base middleware instead
    treeMiddleware.create(req.body)
        .then((success: boolean) => {
            if (success) {
                res.status(201);
                res.json(true);
            } else {
                res.status(400);
                res.json(false);
            }
        })
        .catch((e: unknown) => {
    winston.log('error' ,  e);
            console.log('ERROR: ', e);
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            res.status(500);
            res.json(e);
        });
});

router.get('/:id', (req: Request, res: Response) => {
    const treeMiddleware = new TreeMiddleware;

    treeMiddleware.getTree(parseInt(req.params.id))
        .then((r: FamilyTree | null) => {
            res.status(200);
            res.json(r);
        })
        .catch((e: unknown) => {
    winston.log('error' ,  e);
            res.status(500);
            res.json(e);
        });
});

router.get('/:id/families', (req: Request, res: Response) => {
    const treeMiddleware = new TreeMiddleware;
    // TODO: there's definitely a way to add the create function to the base middleware instead
    treeMiddleware.getFamilies(parseInt(req.params.id))
        .then((families: number[] | undefined) => {
            if (families) {
                res.status(201);
                res.json(families);
            } else {
                res.status(400);
                res.json(null);
            }
        })
        .catch((e: unknown) => {
    winston.log('error' ,  e);
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            res.status(500);
            res.json(e);
        });
});

router.put('/:id', (req: Request, res: Response) => {
    const treeMiddleware = new TreeMiddleware;
    const values = { ...req.body };

    // TODO: there's definitely a way to add the create function to the base middleware instead
    treeMiddleware.update(values, parseInt(req.params.id))
        .then((success: boolean) => {
            if (success) {
                res.status(201);
                res.json(success);
            } else {
                res.status(400);
                res.json(null);
            }
        })
        .catch((e: unknown) => {
    winston.log('error' ,  e);
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            res.status(500);
            res.json(e);
        });
});

router.put('/:id/families', (req: Request, res: Response) => {
    const treeMiddleware = new TreeMiddleware;
    // TODO: there's definitely a way to add the create function to the base middleware instead
    // treeMiddleware.addFamily(parseInt(req.params.id), req.body.id)
    //     .then((success: boolean) => {
    //         if (success) {
    //             res.status(201);
    //             res.json(success);
    //         } else {
    //             res.status(400);
    //             res.json(null);
    //         }
    //     })
    //     .catch((e: unknown) => {
    // winston.log('error' ,  e);
    //         // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
    //         console.log('ERROR: ', e);

    //         res.status(500);
    //         res.json(e);
    //     });
});

router.put('/:id/families/remove', (req: Request, res: Response) => {
    const treeMiddleware = new TreeMiddleware;
    // TODO: there's definitely a way to add the create function to the base middleware instead
    treeMiddleware.removeFamily(parseInt(req.params.id), req.body.id)
        .then((success: boolean) => {
            if (success) {
                res.status(201);
                res.json(success);
            } else {
                res.status(400);
                res.json(null);
            }
        })
        .catch((e: unknown) => {
    winston.log('error' ,  e);
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            console.log('ERROR: ', e);

            res.status(500);
            res.json(e);
        });
});

export default router;