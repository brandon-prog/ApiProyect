"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const User_1 = require("../entities/User");
const accountNumberGenerator_1 = require("../services/accountNumberGenerator");
const mail_1 = require("../config/mail");
const pug_1 = __importDefault(require("pug"));
const path_1 = __importDefault(require("path"));
const userRepo = db_1.AppDataSource.getRepository(User_1.User);
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await userRepo.findOneBy({ email });
        if (existing)
            return res.status(400).json({ message: 'Email already exists' });
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const account_number = (0, accountNumberGenerator_1.generateAccountNumber)();
        const newUser = userRepo.create({
            name,
            email,
            password: hashedPassword,
            account_number,
            balance: 1000.00,
        });
        await userRepo.save(newUser);
        // Enviar correo
        const html = pug_1.default.renderFile(path_1.default.join(__dirname, '../views/register-confirmation.pug'), {
            name,
            account_number,
        });
        await mail_1.transporter.sendMail({
            to: email,
            subject: 'Registro exitoso',
            html,
        });
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error interno', error: err });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userRepo.findOneBy({ email });
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ message: 'Error interno', error: err });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    const user = req.user;
    res.json(user);
};
exports.getProfile = getProfile;
