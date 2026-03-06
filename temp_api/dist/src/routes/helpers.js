"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSession = exports.isUserAuthenticated = exports.getSessionUser = exports.sendRouteHandlerResponse = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const sendRouteHandlerResponse = (requestPayload, action, response, actionName, request) => {
    // you'r ismanaging ssion pn dirait. localstorag id should b same as session in db. it also looks like dozens of Session records are creatvd
    // TODO: supabase and vercel, and Im sure other PAAS offer built in sign in with providers (google, github, etc)
    action(requestPayload)
        .then((data) => {
        var _a;
        logger_1.default.info('Call successful', { actionName, data });
        if (request && data.payload && (data === null || data === void 0 ? void 0 : data.addToSession)) {
            request.session.details = Object.assign(Object.assign({}, ((_a = request === null || request === void 0 ? void 0 : request.session) === null || _a === void 0 ? void 0 : _a.details) || {}), data.payload);
            request.session.save((err) => {
                if (err) {
                    logger_1.default.error('Failed to save session', { error: err, sessionId: request.sessionID });
                }
                else {
                    logger_1.default.info('Updated Express session: ', { session: request.session });
                }
            });
            // //TODO: update this AND encrypt/hash emails before sending to local storage
        }
        response.status(data.code);
        response.json(data);
    })
        .catch((e) => {
        logger_1.default.error(`${actionName}: failed operation`, e);
        response.status(500);
        response.json({
            error: true,
            code: 500,
            message: 'Internal server error',
            payload: null
        });
    });
};
exports.sendRouteHandlerResponse = sendRouteHandlerResponse;
/**
 * Helper function to get current session user data
 * @param req - Express request object
 * @returns Session user data or null if not available
 */
const getSessionUser = (req) => {
    var _a;
    logger_1.default.info('SESSION ', req === null || req === void 0 ? void 0 : req.session);
    return ((_a = req.session) === null || _a === void 0 ? void 0 : _a.details) || null;
};
exports.getSessionUser = getSessionUser;
/**
 * Helper function to check if user is authenticated
 * @param req - Express request object
 * @returns Boolean indicating if user is authenticated
 */
const isUserAuthenticated = (req) => {
    var _a, _b;
    // Check if session exists first
    if (!(req === null || req === void 0 ? void 0 : req.session)) {
        logger_1.default.info('Session VALIDATOR - No session found', { hasSession: false });
        return false;
    }
    const hasUserDetails = !!((_a = req.session.details) === null || _a === void 0 ? void 0 : _a.userId);
    let active = true;
    // Safely check cookie expiration
    if ((_b = req.session.cookie) === null || _b === void 0 ? void 0 : _b.expires) {
        active = new Date(req.session.cookie.expires) > new Date();
    }
    logger_1.default.info('Session VALIDATOR ', {
        hasSession: !!req.session,
        sessionId: req.sessionID,
        details: req.session.details,
        active,
        hasUserDetails
    });
    // the presence of the details object means all the user info is available in the session store. Block otherwise
    return hasUserDetails && active;
};
exports.isUserAuthenticated = isUserAuthenticated;
/**
 * Helper function to clear session data
 * @param req - Express request object
 * @param callback - Optional callback after session destruction
 */
const clearSession = (req, callback) => {
    try {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    logger_1.default.error('Failed to destroy session', { error: err });
                }
                else {
                    logger_1.default.info('Session destroyed successfully');
                }
                if (callback)
                    callback();
            });
        }
        else if (callback) {
            callback();
        }
    }
    catch (error) {
        logger_1.default.error('Failed to clear session', { error });
        if (callback)
            callback();
    }
};
exports.clearSession = clearSession;
