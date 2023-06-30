"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const FT_family_routes_1 = __importDefault(require("./routes/FT/FT.family.routes"));
const FT_user_routes_1 = __importDefault(require("./routes/FT/FT.user.routes"));
const User_routes_1 = __importDefault(require("./routes/tracker/User.routes"));
const FT_auth_routes_1 = __importDefault(require("./routes/FT/FT.auth.routes"));
const FT_tree_routes_1 = __importDefault(require("./routes/FT/FT.tree.routes"));
const app = (0, express_1.default)();
/**
 MIDDLEWARES SECTION
 **/
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// TRACKER APP
app.use('/api/users', User_routes_1.default);
// FT APP
app.use('/api/FT/auth', FT_auth_routes_1.default);
app.use('/api/FT/trees', FT_tree_routes_1.default);
app.use('/api/FT/families', FT_family_routes_1.default);
app.use('/api/FT/users', FT_user_routes_1.default);
/** END */
const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}. .PLEASE CHECK TODOS`));
