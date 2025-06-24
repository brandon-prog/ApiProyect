"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.initMailer = initMailer;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function initMailer() {
    const testAccount = await nodemailer_1.default.createTestAccount();
    exports.transporter = nodemailer_1.default.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    console.log('📨 Ethereal credentials:');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
}
