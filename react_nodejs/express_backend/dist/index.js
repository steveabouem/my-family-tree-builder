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
const session_routes_1 = __importDefault(require("./src/routes/session.routes"));
const app = (0, express_1.default)();
const MySQLStore = require('express-mysql-session')(express_session_1.default);
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
app.use((0, cors_1.default)({
    credentials: true,
    optionsSuccessStatus: 200,
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}));
app.use(body_parser_1.default.json({}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: `${process.env.JWT_KEY}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',
        secure: false,
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
    }
    else {
        res.status(403);
        res.json('Unauthenticated');
    }
});
app.use('/api/users', user_routes_1.default);
app.use('/api/sessions', session_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
// app.use('/api/trees', familyTreeHandler);
// app.use('/api/members', familyMemberHandler);
/** END */
const port = 4000;
try {
    app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS/TOFIX`));
}
catch (e) {
    console.log('Server error ', e);
}
