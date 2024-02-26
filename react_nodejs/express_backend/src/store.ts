import sequelize from './db';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import Sequelize from 'sequelize';

sequelize.define("stored_sessions", {
  sid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  userId: Sequelize.STRING,
  expires: Sequelize.DATE,
  data: Sequelize.TEXT,
});

const storeBuilder = SequelizeStore(session.Store);
// const extendDefaultFields = (defaults: any, session: any) => ({
//   data: defaults.data,
//   expires: defaults.expires,
//   userId: session.userId,
//   details: ''
// });

const store =  new storeBuilder({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
  table: 'stored_sessions',
});

store.sync();

export default store;