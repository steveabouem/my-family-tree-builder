import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import FTFamilyHandler from './src/routes/FT/FT.family.routes';
import FTUserHandler from './src/routes/FT/FT.user.routes';
import userHandler from './src/routes/tracker/User.routes';
import FTAuthHandler from './src/routes/FT/FT.auth.routes';
import FTTreeHandler from './src/routes/FT/FT.tree.routes';
import FTSessionHandler from './src/routes/FT/FT.session.routes';
import FTSessionService from './src/services/FT/session/FT.session.service';
const app: Express = express();
/**
 MIDDLEWARES SECTION
 **/
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// TRACKER APP
app.use('/api/users', userHandler);

// FT APP
app.use((req, res, next) => {
  console.log('CURRENT SESSION TOKEN sess: ', req.cookies?.FT);

  const ftSessionService = new FTSessionService();
  const currentUserSession = ftSessionService.getUserSessionData(req.cookies.FT);
  console.log({ currentUserSession });

  next();
});
app.use('/api/FT/session', FTSessionHandler);
app.use('/api/FT/auth', FTAuthHandler);
app.use('/api/FT/trees', FTTreeHandler);
app.use('/api/FT/families', FTFamilyHandler);
app.use('/api/FT/users', FTUserHandler);
/** END */

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS`));