import { Router, Request, Response, NextFunction } from "express";
import FTUser from "../../models/FT.user";
import FTAuthService from "../../services/FT/auth/FT.auth.service";
import { FTUserService } from "../../services/FT/user/FT.user.service";


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
            res.status(400);
            res.json('Error: ' + e);
        });

    next();
});

// TODO: typing of req body for post requst
router.post('/register', (req: Request, res: Response) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ftUserService = new FTUserService();
    const formattedValues = { ...req.body, assigned_ips: [ip], created_at: new Date };

    // TODO: can i have a way to handle this promise elsewhere, to avoid the then block?
    // TODO: use ftuser service to match spouse's first and last name and return id here.
    // in the front, it will be some sort of dd that will use the ServiceWorker, and add the id to the form values
    ftUserService.create(formattedValues)
        .then((r: boolean) => {
            res.status(201);
            res.json(r);
        }).catch(e => {
            // TODO: catch return false doesnt actually catch falty logic, 
            // just wrong syntax and maybe wrong typing. FIX
            res.status(400);
            res.json('Error: ' + e);
        }); // TODO: handle redirect in client
});

// TODO: req, res typing
router.post('/login', (req: Request, res: Response) => {
    const authService = new FTAuthService();
    authService.verifyUser(req.body)
        .then((valid: boolean) => {
            if (valid) {
                res.status(200);
                res.json(true);
            } else {
                res.status(400);
                res.json(false);
            }
        });
    // TODO: session
});

router.get('/logout', (req: Request, res: Response) => {
    // TODO: do I need to reinitialize anything here?
});

export default router;


// const { QueryTypes } = require('sequelize');

// await sequelize.query(
//     'SELECT * FROM users WHERE name LIKE :search_name',
//     {
//         replacements: { search_name: 'ben%' },
//         type: QueryTypes.SELECT
//     }
// );