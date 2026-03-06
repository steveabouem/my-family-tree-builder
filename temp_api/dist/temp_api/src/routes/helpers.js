"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRouteHandlerResponse = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const sendRouteHandlerResponse = (requestPayload, action, response, actionName) => {
    logger_1.default.info('Processing ', { actionName, payload: requestPayload });
    action(requestPayload)
        .then((data) => {
        logger_1.default.info('Call succesfull: ', { data });
        response.status(data.code);
        response.json(data);
    })
        .catch((e) => {
        response.status(500);
        logger_1.default.error(actionName, ': failed operation: ', e);
        response.json('error');
    });
};
exports.sendRouteHandlerResponse = sendRouteHandlerResponse;
