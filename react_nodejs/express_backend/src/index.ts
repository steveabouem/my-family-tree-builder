import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import familyHandlers from './routes/FTFam';
import BaseController from './controllers/Base.controller';
import { DUserDTO } from './dtos/user.dto';

const app: Express = express();
/**
 MIDDLEWARES SECTION
 **/
app.use(cors());
app.use('/api/family', familyHandlers);
/** END */

/**
 ROUTE HANDLERS
 **/
app.get('/', (req: Request, res: Response, next) => {
    const test = new BaseController('Objectives');
    test.getById(1).then((r: any) => {
        res.send(r);
    });
});
/** END */

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS`))