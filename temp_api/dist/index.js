"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const auth_routes_1 = __importDefault(require("./src/routes/auth.routes"));
const familyTree_routes_1 = __importDefault(require("./src/routes/familyTree.routes"));
const familyMember_routes_1 = __importDefault(require("./src/routes/familyMember.routes"));
const app = (0, express_1.default)();
const MySQLStore = require('express-mysql-session')(express_session_1.default);
const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB,
    checkExpirationInterval: 30000,
    clearExpired: true,
    createDatabaseTable: false,
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
/**
 MIDDLEWARES
 **/
app.use((0, cors_1.default)({
    credentials: true,
    optionsSuccessStatus: 200,
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}));
app.use(body_parser_1.default.json({ limit: '5mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '5mb' }));
const sessionConfig = {
    name: process.env.COOKIE_NAME || 'connect.sid',
    secret: `${process.env.JWT_KEY}`,
    saveUninitialized: true,
    resave: false, // Don't save session if unmodified
    cookie: {
        sameSite: false,
        secure: false, //TODO: change to true for PROD
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    },
    store: sessionStore,
};
app.use((0, express_session_1.default)(sessionConfig));
app.use('/api/users', user_routes_1.default);
app.use('/api/members', familyMember_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/trees', familyTree_routes_1.default);
/** END */
const port = 4000;
try {
    app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK RUN TS LINT`));
}
catch (e) {
    console.log('Server error ', e);
}
