"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
class RequestHelper {
    constructor(req, res) {
        this.request = req;
        this.response = res;
    }
    /*
    * Receives req, response and a description of the controller action
    * handles logging the error
    */
    sendResponseFromControllerMethod(action, actionName) {
        const { request, response } = this;
        logger_1.default.info('Processing ', { actionName, payload: request === null || request === void 0 ? void 0 : request.body });
        action(request)
            .then((data) => {
            logger_1.default.info('Call succesfull: ', { data });
            response.status(data.code);
            response.json(data);
        })
            .catch((e) => {
            response.status(500);
            logger_1.default.error(actionName, ': failed operation: ', e);
        });
    }
}
exports.default = RequestHelper;
