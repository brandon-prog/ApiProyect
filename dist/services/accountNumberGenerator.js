"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccountNumber = generateAccountNumber;
function generateAccountNumber() {
    const timestamp = Date.now().toString().slice(-8);
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString(); 
    return timestamp + randomDigits; 
}
