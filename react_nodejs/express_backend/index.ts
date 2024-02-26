import express, { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import userHandler from './src/routes/user.routes';
import authHandler from './src/routes/auth.routes';
import familyTreeHandler from './src/routes/familyTree.routes';
import familyMemberHandler from './src/routes/familyMembers.routes';
import sessionHandler from './src/routes/session.routes';
import { DSessionUser } from './src/controllers/controllers.definitions';
import store from './src/store';

const app: Express = express();
// Augment express-session with a custom SessionData object
declare module "express-session" {
  // see https://akoskm.com/how-to-use-express-session-with-custom-sessiondata-typescript
  interface SessionData {
    details: Partial<DSessionUser>,
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
  // cookie: {
  //   sameSite: 'none',
  //   secure: false, //TODO: change to true for PROD
  //   maxAge: 300000,
  // },
  store,
}));

// app.use((req, res, next) => {
//   const publicUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/register'];
//   console.log(req.session);

//   if (req.session || publicUrls.includes(req.originalUrl)) {
//     next();
//   } else {
//     res.status(401);
//     res.json('Unauthorized');
//   }
// });
app.use('/api/users', userHandler);
app.use('/api/sessions', sessionHandler);
app.use('/api/auth', authHandler);
app.use('/api/trees', familyTreeHandler);
app.use('/api/members', familyMemberHandler);
app.use('/api/users', userHandler);
/** END */

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS/TOFIX`));