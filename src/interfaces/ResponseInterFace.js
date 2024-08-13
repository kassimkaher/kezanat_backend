"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.sucessResponse = void 0;
const sucessResponse = (message, data) => {
    return {
        status: true,
        message: message,
        data: data,
        error: null
    };
};
exports.sucessResponse = sucessResponse;
const errorResponse = (message, error) => {
    return {
        status: false,
        message: message,
        data: null,
        error: error
    };
};
exports.errorResponse = errorResponse;
