"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var base_middleware_1 = require("../base/base.middleware");
// TODO: I feel like the controlle should use a generic of the DTO and the middleware a generic of the record, somtheing like that
var UserMiddleware = /** @class */ (function (_super) {
    __extends(UserMiddleware, _super);
    function UserMiddleware() {
        return _super.call(this, 'Users') || this;
    }
    return UserMiddleware;
}(base_middleware_1.BaseMiddleware));
exports.UserMiddleware = UserMiddleware;
var test = new UserMiddleware();
console.log(test.tableName);
