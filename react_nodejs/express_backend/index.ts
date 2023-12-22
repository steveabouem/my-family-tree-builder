import express, { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import FTFamilyHandler from './src/routes/FT.family.routes';
import FTUserHandler from './src/routes/FT.user.routes';
import userHandler from './src/routes/User.routes';
import FTAuthHandler from './src/routes/FT.auth.routes';
import FTTreeHandler from './src/routes/FT.tree.routes';
import FTSessionHandler from './src/routes/FT.session.routes';
import FTSessionMiddleware from './src/middleware-classes/session/FT.session.middleware';
const app: Express = express();
/**
 MIDDLEWARES SECTION
 **/
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: 'alloman',
  cookie: {
    sameSite: 'strict',
    httpOnly: true,
    secure: true,
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));

// TRACKER APP
app.use('/api/users', userHandler);

// FT APP
app.use((req, res, next) => {
  console.log('CURRENT SESSION TOKEN sess: ', req.cookies?.FT);

  const ftSessionMiddleware = new FTSessionMiddleware();
  // const currentUserSession = ftSessionMiddleware.getSessionData(req.cookies.FT);
  // console.log({ currentUserSession });

  next();
});
app.use('/api/session', FTSessionHandler);
app.use('/api/auth', FTAuthHandler);
app.use('/api/trees', FTTreeHandler);
app.use('/api/families', FTFamilyHandler);
app.use('/api/users', FTUserHandler);
/** END */

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS`));