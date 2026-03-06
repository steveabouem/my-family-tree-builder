"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const helpers_1 = require("./helpers");
const authCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const publicUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/register'];
    // Check if this is a public URL (check multiple URL properties for robustness)
    const isPublicUrl = publicUrls.some(url => {
        var _a, _b, _c;
        return req.url === url ||
            req.path === url ||
            req.originalUrl === url ||
            ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith(url)) ||
            ((_b = req.path) === null || _b === void 0 ? void 0 : _b.startsWith(url)) ||
            ((_c = req.originalUrl) === null || _c === void 0 ? void 0 : _c.startsWith(url));
    });
    // If it's a public URL, allow access
    if (isPublicUrl) {
        return next();
    }
    // Ensure session is loaded - reload if session exists but details are missing
    if (req.sessionID && req.session && !req.session.details) {
        try {
            // Try to reload the session from the store
            yield new Promise((resolve, reject) => {
                req.session.reload((err) => {
                    if (err) {
                        logger_1.default.error('authCheck - Failed to reload session', { error: err, sessionId: req.sessionID });
                        // Don't reject - continue with authentication check even if reload fails
                        resolve();
                    }
                    else {
                        logger_1.default.info('authCheck - Session reloaded successfully', { sessionId: req.sessionID, details: req.session.details });
                        resolve();
                    }
                });
            });
        }
        catch (error) {
            logger_1.default.error('authCheck - Session reload error', { error, sessionId: req.sessionID });
            // Continue with authentication check even if reload fails
        }
    }
    // Log session details for debugging
    logger_1.default.info('authCheck - Session check', {
        url: req.url,
        path: req.path,
        originalUrl: req.originalUrl,
        sessionId: req.sessionID,
        hasSession: !!req.session,
        sessionDetails: (_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.details,
        cookie: req.headers.cookie,
    });
    const userAuthenticated = (0, helpers_1.isUserAuthenticated)(req);
    if (userAuthenticated) {
        return next();
    }
    else {
        logger_1.default.error('authCheck - Unauthenticated request', {
            url: req.url,
            path: req.path,
            originalUrl: req.originalUrl,
            sessionId: req.sessionID,
            hasSession: !!req.session,
            sessionDetails: (_b = req === null || req === void 0 ? void 0 : req.session) === null || _b === void 0 ? void 0 : _b.details,
            userAuthenticated,
        });
        res.status(403);
        res.json({
            error: true,
            code: 403,
            message: 'Unauthenticated',
            payload: null
        });
    }
});
exports.authCheck = authCheck;
