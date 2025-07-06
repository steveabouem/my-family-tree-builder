"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_middleware_1 = require("../base/base.middleware");
// ! TODO: THIS LOOKS USELESS SO frameElement. MIGHT DELETE THIS MIDDLEWARE ENTIRELY
class SessionMiddleware extends base_middleware_1.BaseMiddleware {
    constructor() {
        super('Sessions');
    }
}
exports.default = SessionMiddleware;
