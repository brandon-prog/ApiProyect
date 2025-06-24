"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const data_source_1 = require("./config/data-source");
const mail_1 = require("./config/mail");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
async function createApp() {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log('✅ Database connected');
    }
    catch (err) {
        console.error('❌ DB connection error:', err);
        process.exit(1);
    }
    try {
        await (0, mail_1.initMailer)();
        console.log('✅ Mailer initialized');
    }
    catch (err) {
        console.error('❌ Mailer init error:', err);
        process.exit(1);
    }
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/api/auth', auth_routes_1.default);
    app.use('/api/transactions', transaction_routes_1.default);
    return app;
}
