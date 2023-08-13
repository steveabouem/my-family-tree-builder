"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateValid = void 0;
const dateValid = (date) => {
    // @ts-ignore
    return (!date || date instanceof Date && !isNaN(date));
};
exports.dateValid = dateValid;
