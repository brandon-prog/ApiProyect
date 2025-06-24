"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: decoded.id });
        if (!user) {
            res.status(401).json({ message: 'Usuario no encontrado' });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
exports.authMiddleware = authMiddleware;
