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
exports.generateResponseData = void 0;
exports.extractSingleDataValuesFrom = extractSingleDataValuesFrom;
exports.extractGroupDataValuesFrom = extractGroupDataValuesFrom;
exports.processIncomingImage = processIncomingImage;
exports.processOutgoingImage = processOutgoingImage;
const logger_1 = __importDefault(require("../utils/logger"));
const generateResponseData = (data) => {
    return {
        error: true,
        code: 500,
        payload: data
    };
};
exports.generateResponseData = generateResponseData;
/**
 * extract the dataValues property of any Sequelize Model that a service function would need
 * @param bindings
 * @param entity
 * @returns
 */
function extractSingleDataValuesFrom(entity, bindings) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield entity.findOne(bindings);
        if (record === null || record === void 0 ? void 0 : record.dataValues) {
            return record.dataValues;
        }
        return null;
    });
}
function extractGroupDataValuesFrom(entity, bindings) {
    return __awaiter(this, void 0, void 0, function* () {
        const records = yield entity.findAll(bindings);
        if (records === null || records === void 0 ? void 0 : records.length) {
            return records.map((r) => r.dataValues);
        }
        return null;
    });
}
/**
 * Processes incoming image data and returns a standardized format for storage.
 * Handles:
 * - External URLs (http/https) - returns as-is
 * - Data URLs (data:image/...) - normalizes and validates format
 * - Plain base64 strings - wraps in data URL format
 *
 * @param img - Image data (URL string, data URL string, or base64 string)
 * @returns Formatted image string ready for database storage, or null if no image provided
 */
function processIncomingImage(img) {
    if (!img || typeof img !== "string") {
        logger_1.default.info('processIncomingImage: received non-string or mpty image data', { type: typeof img });
        return null;
    }
    if (typeof img == 'string') {
        if (img.startsWith('http://') || img.startsWith('https://')) {
            // External URL - return as-is
            logger_1.default.info('processIncomingImage: External URL detected', { url: img });
            return img;
        }
        else if (img.startsWith('data:image')) {
            // Data URL format - normalize and validate
            const base64Data = img.replace(/^data:image\/\w+;base64,/, '');
            try {
                // Validate base64 by attempting to decode
                const buffer = Buffer.from(base64Data, 'base64');
                const base64String = buffer.toString('base64');
                const normalized = `data:image/png;base64,${base64String}`;
                logger_1.default.info('processIncomingImage: Normalized data URL', { originalLength: img.length, normalizedLength: normalized.length });
                return normalized;
            }
            catch (error) {
                logger_1.default.error('processIncomingImage: Invalid base64 data in data URL', { error });
                return null;
            }
        }
    }
    return null;
}
/**
 * Processes outgoing image data from db to prepare for front
 * It will be either:
 * - Standard URLs (http/https) - returns as-is
 * - Data URLs (data:image/...) - change to base64 string
 *
 * @param img - Image data (URL string, data URL string, or base64 string)
 * @returns Base64 image string ready for client
 */
function processOutgoingImage(img) {
    logger_1.default.info('processOutgoingImage: External URL detected', { url: img });
    if (typeof img == 'string') {
        // External URL - return as-is
        return img;
    }
    else {
        // Plain base64 string (legacy format) - wrap in data URL format
        try {
            // Validate base64 by attempting to decode
            const buffer = Buffer.from(img, 'base64');
            const base64String = buffer.toString('base64');
            const wrapped = `data:image/png;base64,${base64String}`;
            logger_1.default.info('processOutgoingImage: Wrapped plain base64 in data URL format');
            return wrapped;
        }
        catch (error) {
            logger_1.default.error('processOutgoingImage: Invalid base64 string', { error });
            return null;
        }
    }
}
