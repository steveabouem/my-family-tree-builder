import express, { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import userHandler from './src/routes/user.routes';
import authHandler from './src/routes/auth.routes';
import familyTreeHandler from './src/routes/familyTree.routes';
import sessionHandler from './src/routes/session.routes';
// import projectHandler from './src/routes/project.routes';
// import teamHandler from './src/routes/team.routes';
import { APISessionUser } from './src/services/types';
import { isUserAuthenticated } from './src/routes/helpers';
import logger from '@/utils/logger';

declare module "express-session" {
  // see https://akoskm.com/how-to-use-express-session-with-custom-sessiondata-typescript
  interface SessionData extends Session {
    details: any, // TODO: reinstate line below
    // details: Partial<APISessionUser>,
    sessionId: string,
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
  checkExpirationInterval: 30000,
  schema: {
		tableName: 'Sessions',
		columnNames: {
			  session_id: 'sid',
        expires: 'expires',
        data: 'data'
		}
	}
};

const sessionStore = new MySQLStore(options);
sessionStore.onReady().catch((error: any) => {
  console.log('##################FAILED', error);
});
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
const sessionConfig = {
  secret: `${process.env.JWT_KEY}`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: 'none' as const,
    secure: false, //TODO: change to true for PROD
    maxAge: 300000,
  },
  store: sessionStore,
} as any;

app.use(session(sessionConfig) as any);

app.use((req, res, next) => {
  const publicUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/register'];
  const userAuthenticated = isUserAuthenticated(req);

  if (userAuthenticated || publicUrls.includes(req.originalUrl)) {
    next();
  } else {
    res.status(403);
    res.json({
      error: true,
      code: 403,
      message: 'Unauthenticated',
      payload: null
    });
  }
});
app.use('/api/users', userHandler);
// app.use('/api/sessions', sessionHandler);
app.use('/api/auth', authHandler);
app.use('/api/trees', familyTreeHandler);
/** END */

const port = 4000;
try {
  app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS/TOFIX`));
} catch (e) {
  console.log('Server error ', e);
}