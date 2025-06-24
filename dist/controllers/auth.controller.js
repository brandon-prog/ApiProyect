"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const accountNumberGenerator_1 = require("../services/accountNumberGenerator");
const mail_1 = require("../config/mail");
const pug_1 = __importDefault(require("pug"));
const path_1 = __importDefault(require("path"));
const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existing = await userRepo.findOneBy({ email });
        if (existing) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const account_number = (0, accountNumberGenerator_1.generateAccountNumber)();
        const newUser = userRepo.create({
            name,
            email,
            password: hashedPassword,
            account_number,
            balance: 1000.0,
            isEmailVerified: true
        });
        await userRepo.save(newUser);
        const html = pug_1.default.renderFile(path_1.default.join(__dirname, '../views/register-confirmation.pug'), { name, account_number });
        await mail_1.transporter.sendMail({
            to: email,
            subject: 'Registro exitoso',
            html,
        });
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    }
    catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ message: 'Error interno', error: err });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Intentando login con:', email);
        const user = await userRepo.findOneBy({ email });
        if (!user) {
            console.warn('Usuario no encontrado:', email);
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            console.warn('Contraseña incorrecta para:', email);
            res.status(401).json({ message: 'Contraseña incorrecta' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '3h' });
        console.log('Login exitoso para:', email);
        res.json({ token });
    }
    catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: 'Error interno', error: err });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    res.json(req.user);
};
exports.getProfile = getProfile;
