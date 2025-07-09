import express, { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import userHandler from './src/routes/user.routes';
import authHandler from './src/routes/auth.routes';
import familyTreeHandler from './src/routes/familyTree.routes';
import familyMemberHandler from './src/routes/familyMembers.routes';
import sessionHandler from './src/routes/session.routes';
import { APISessionUser } from './src/controllers/controllers.definitions';

declare module "express-session" {
  // see https://akoskm.com/how-to-use-express-session-with-custom-sessiondata-typescript
  interface SessionData {
    details: Partial<APISessionUser>,
    sessionId: string
  }
}

const app: Express = express();
const MySQLStore = require('express-mysql-session')(session);
const options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB,
};
const store = new MySQLStore(options);

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
  cookie: {
    sameSite: 'none',
    secure: false, //TODO: change to true for PROD
    maxAge: 300000,
  },
  store,
}));

app.use((req, res, next) => {
  const publicUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/register'];
  const userAuthenticated = true;
  // const userAuthenticated = req.session.details?.authenticated || false;
  if (userAuthenticated || publicUrls.includes(req.originalUrl)) {
    next();
  } else {
    res.status(403);
    res.json('Unauthenticated');
  }
});
app.use('/api/users', userHandler);
// app.use('/api/sessions', sessionHandler);
// app.use('/api/auth', authHandler);
// app.use('/api/trees', familyTreeHandler);
// app.use('/api/members', familyMemberHandler);
/** END */

const port = 4000;
try {
  app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS/TOFIX`));
} catch (e) {
  console.log('Server error ', e);
}