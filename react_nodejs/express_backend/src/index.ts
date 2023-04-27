import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import FTFamilyHandler from './routes/FT/FT.family.routes';
import FTUserHandler from './routes/FT/FT.user.routes';
import userHandler from './routes/tracker/User.routes';
import FTAuthHandler from './routes/FT/FT.auth.routes';
import FTTreeHandler from './routes/FT/FT.tree.routes';
const app: Express = express();
/**
 MIDDLEWARES SECTION
 **/
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TRACKER APP
app.use('/api/users', userHandler);

// FT APP
app.use('/api/FT/auth', FTAuthHandler);
app.use('/api/FT/trees', FTTreeHandler);
app.use('/api/FT/families', FTFamilyHandler);
app.use('/api/FT/users', FTUserHandler);
/** END */

/**
 ROUTE HANDLERS
 **/
// app.get('/', (req: Request, res: Response, next) => {
//     const test = new BaseController('Objectives');
//     test.getById(1).then((r: any) => {
//         res.send(r);
//     });
// });
/** END */

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS`))