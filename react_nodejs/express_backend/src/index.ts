import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import FTFamilyHandlers from './routes/FT/FT.family.routes';
import FTUserHandlers from './routes/FT/FT.user.routes';
import userHandlers from './routes/tracker/User.routes';
import FTAuthHandler from './routes/FT/FT.auth.routes';
import BaseController from './controllers/Base.controller';
const app: Express = express();
/**
 MIDDLEWARES SECTION
 **/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TRACKER APP
app.use('/api/users', userHandlers);

// FT APP
app.use('/api/FT/families', FTFamilyHandlers);
app.use('/api/FT/users', FTUserHandlers);
app.use('/api/FT/auth', FTAuthHandler);
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