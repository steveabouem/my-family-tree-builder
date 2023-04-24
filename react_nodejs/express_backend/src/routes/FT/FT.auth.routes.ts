import { Router, Request, Response, NextFunction } from "express";
import FTAuthService from "../../services/FT/auth/FT.auth.service";
import { FTUserService } from "../../services/FT/user/FT.user.service";


const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    next();
});

// TODO: typing of req body for post requst
router.post('/register', (req: Request, res: Response) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const authService = new FTAuthService();
    const ftUserService = new FTUserService();
    console.log('STARTING HANDLING');

    // TODO: can i have a way to handle this promise elsewhere, to avoid the then block??
    authService.verifyIp(ip)
        .then((valid: boolean) => {
            if (!valid) {
                res.send('Acces Restreint'); //TODO: use error codes in logs, not verbatum errors. Exp: error 12 would mean password too short
            }

            const entriesValid = ftUserService.validateFTUserFields(req.body);
            if (entriesValid) {
                ftUserService.create(req.body)
                    .then((r: boolean) => res.send(r));
            } else {
                res.send('Acces Restreint');//TODO: use error codes in logs, not verbatum errors. Exp: error 12 would mean password too short

            }
        })
        .catch(e => {
            // TODO: catch return false doesnt actually catch falty logic, 
            // just wrong syntax and maybe wrong typing. FIX
            res.send('Error ' + e);
        });

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