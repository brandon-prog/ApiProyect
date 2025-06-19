"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isPositiveNumber = isPositiveNumber;
function isValidEmail(email) {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
}
function isPositiveNumber(n) {
    return typeof n === 'number' && n > 0;
}
