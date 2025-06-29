import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source'; 
import { User } from '../entities/User';
import { generateAccountNumber } from '../services/accountNumberGenerator';
import { transporter } from '../config/mail';
import pug from 'pug';
import path from 'path';

const userRepo = AppDataSource.getRepository(User);

interface AuthRequest extends Request {
  user: User;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existing = await userRepo.findOneBy({ email });
    if (existing) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const account_number = generateAccountNumber();

    const newUser = userRepo.create({
      name,
      email,
      password: hashedPassword,
      account_number,
      balance: 1000.0,
      isEmailVerified: true 
    });

    await userRepo.save(newUser);

    const html = pug.renderFile(
      path.join(__dirname, '../views/register-confirmation.pug'),
      { name, account_number }
    );

    await transporter.sendMail({
      to: email,
      subject: 'Registro exitoso',
      html,
    });

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error interno', error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    console.log('Intentando login con:', email);

    const user = await userRepo.findOneBy({ email });
    if (!user) {
      console.warn('Usuario no encontrado:', email);
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn('Contraseña incorrecta para:', email);
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY!, { expiresIn: '3h' });
    console.log('Login exitoso para:', email);

    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error interno', error: err });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json(req.user);
};
