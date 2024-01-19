import express, { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import FamilyHandler from './src/routes/FT.family.routes';
import UserHandler from './src/routes/FT.user.routes';
import userHandler from './src/routes/User.routes';
import FTAuthHandler from './src/routes/FT.auth.routes';
import FTTreeHandler from './src/routes/FT.tree.routes';
import FTSessionHandler from './src/routes/FT.session.routes';
import FTSessionMiddleware from './src/middleware-classes/session/session.middleware';
import { DSessionUser } from './src/controllers/controllers.definitions';
import sequelize from './src/db';
const app: Express = express();
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Augment express-session with a custom SessionData object
declare module "express-session" {
  // see https://akoskm.com/how-to-use-express-session-with-custom-sessiondata-typescript
  interface SessionData {
    data: Partial<DSessionUser>,
    sessionId: string
  }
}

/**
 MIDDLEWARES
 **/
app.use(cors({
  credentials: true,
  optionsSuccessStatus: 200,
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}
));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: `${process.env.JWT_KEY}`,
  resave: false,
  saveUninitialized: false,
  name: 'FT',
  
  cookie: {
    sameSite: 'none',
    // httpOnly: false,
    secure: false, //TODO: change to true for PROD
    maxAge: 300000,
    // path: "/FT"
  },
  store: new SequelizeStore({
    db: sequelize,
  }),
}));
app.use('/api/users', userHandler);
app.use((req, res, next) => {
  console.log('CURRENT SESSION TOKEN sess: ', req.cookies);
  const ftSessionMiddleware = new FTSessionMiddleware();
  // const currentUserSession = ftSessionMiddleware.getSessionData(req.cookies.FT);
  // console.log({ currentUserSession });

  next();
});
app.use('/api/session', FTSessionHandler);
app.use('/api/auth', FTAuthHandler);
app.use('/api/trees', FTTreeHandler);
app.use('/api/families', FamilyHandler);
app.use('/api/users', UserHandler);
/** END */

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS`));