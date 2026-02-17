import express, { Express } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';

import userHandler from './src/routes/user.routes';
import authHandler from './src/routes/auth.routes';
import familyTreeHandler from './src/routes/familyTree.routes';

declare module "express-session" {
  interface SessionData extends Session {
    details: any,
    // TODO: reinstate line below
    // details: Partial<APISessionUser>,
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
  clearExpired: true,
  createDatabaseTable: false,
  resave: false,
  schema: {
    tableName: 'Sessions',
    columnNames: {
      session_id: 'id',
      expires: 'stale_time',
      data: 'data'
    }
  }
};
const sessionStore = new MySQLStore(options);
sessionStore.onReady().then(() => {
	console.log('****************MYSQLSTORE READY*************');
}).catch((error: unknown) => {
	console.error(error);
});
/**
 MIDDLEWARES
 **/
app.use(cors({
  credentials: true,
  optionsSuccessStatus: 200,
  origin: process.env.REACT_APP_URL,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}
));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
const sessionConfig = {
  secret: `${process.env.JWT_KEY}`,
  saveUninitialized: true,
  resave: false, // Don't save session if unmodified
  clearExpired: true,
  cookie: {
    sameSite: false,
    secure: false, //TODO: change to true for PROD
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false, // Prevent client-side JavaScript from accessing the cookie
  },
  store: sessionStore,
};

app.use(session(sessionConfig) as any);
app.use('/api/users', userHandler);
app.use('/api/auth', authHandler);
app.use('/api/trees', familyTreeHandler);
/** END */

const port = 4000;
try {
  app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK RUN TS LINT`));
} catch (e) {
  console.log('Server error ', e);
}