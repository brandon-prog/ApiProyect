import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source'; 
import { User } from '../entities/User';
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Token no proporcionado' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await AppDataSource.getRepository(User).findOneBy({ id: decoded.id });

    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }

    (req as any).user = user; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
