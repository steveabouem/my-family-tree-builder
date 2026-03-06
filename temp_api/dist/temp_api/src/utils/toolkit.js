"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSeasoning = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const addSeasoning = (intensity) => bcryptjs_1.default.genSaltSync(intensity || 8);
exports.addSeasoning = addSeasoning;
