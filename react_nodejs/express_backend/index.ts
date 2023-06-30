import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import FTFamilyHandler from './src/routes/FT/FT.family.routes';
import FTUserHandler from './src/routes/FT/FT.user.routes';
import userHandler from './src/routes/tracker/User.routes';
import FTAuthHandler from './src/routes/FT/FT.auth.routes';
import FTTreeHandler from './src/routes/FT/FT.tree.routes';
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

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS`))