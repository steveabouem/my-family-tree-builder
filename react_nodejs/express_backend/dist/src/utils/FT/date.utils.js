"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateValid = void 0;
const dateValid = (p_date) => {
    // @ts-ignore
    return (!p_date || p_date instanceof Date && !isNaN(p_date));
};
exports.dateValid = dateValid;
