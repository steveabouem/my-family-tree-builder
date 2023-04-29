import { Router, Request, Response, NextFunction } from "express";
import FTFam from "../../models/FT.family";
import FTAuthService from "../../services/FT/auth/FT.auth.service";
import { DFTFamDTO } from "../../services/FT/family/FT.family.definitions";
import { FTFamilyService } from "../../services/FT/family/FT.family.service";
import { DFamilyTreeDTO } from "../../services/FT/tree/FT.tree.definitions";

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const authService = new FTAuthService();

    authService.verifyIp(ip)
        .then((valid: boolean) => {
            if (!valid) {
                res.status(400);
                res.json('IP is not approved');
            }
        })
        .catch(e => {
            // TODO: catch return false doesnt actually catch falty logic, 
            // just wrong syntax and maybe wrong typing. FIX
            res.status(500);
            res.json('Error: ' + e);
        });

    next();
})

// TODO: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.post('/create', (req: Request, res: Response) /**TODO: return type */ => {
    const ftFamService = new FTFamilyService;

    ftFamService.create(req.body)
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
            // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            res.status(500);
            res.json(e);
        });
});

router.get('/:id', (req: Request, res: Response) => {
    const ftFamService = new FTFamilyService;
    ftFamService.getFamily(parseInt(req.params.id))
        .then((r: FTFam | null) => {
            res.status(200);
            res.json(r);
        })
        .catch(e => {
            res.status(500);
            res.json(e);
        });
});

router.put('/:id', (req: Request, res: Response) => {
    const ftFamService = new FTFamilyService;
    console.log('RUNNING');

    ftFamService.update(req.body, parseInt(req.params.id))
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
            console.log(e); //TODO: LOGGING
            res.status(500);
            res.json(e)
        });

});

router.post('/:id/tree', (req: Request, res: Response) => {
    const ftFamService = new FTFamilyService;
    ftFamService.linkToTree(parseInt(req.params.id), req.body.id)
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
            console.log('Error linking tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            res.status(500);
            res.json(false);

        });
});

router.get('/:id/tree', (req: Request, res: Response) => {
    const ftFamService = new FTFamilyService;
    ftFamService.getTree(parseInt(req.params.id))
        .then((tree?: number) => {
            if (tree) {
                res.status(200);
                res.json(tree);
            } else {
                res.status(400);
                res.json(null);
            }
        })
        .catch(e => {
            console.log('Error getting tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
            res.status(500);
            res.json(undefined);
        });
});
export default router;