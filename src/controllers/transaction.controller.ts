import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source'; 
import { Transaction } from '../entities/Transaction';
import { User } from '../entities/User';

const txRepo = AppDataSource.getRepository(Transaction);
const userRepo = AppDataSource.getRepository(User);

interface AuthRequest extends Request {
  user: User;
}

export const makeTransfer = async (req: AuthRequest, res: Response): Promise<void> => {
  const sender = req.user;
  const { account_number, amount } = req.body;

  try {
    const receiver = await userRepo.findOneBy({ account_number });
    if (!receiver) {
      res.status(404).json({ message: 'Cuenta destino no encontrada' });
      return;
    }

    if (sender.id === receiver.id) {
      res.status(400).json({ message: 'No puedes transferirte a ti mismo' });
      return;
    }

    if (sender.balance < amount) {
      res.status(400).json({ message: 'Fondos insuficientes' });
      return;
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await userRepo.save(sender);
    await userRepo.save(receiver);

    const tx = txRepo.create({ sender, receiver, amount });
    await txRepo.save(tx);

    res.status(201).json({ message: 'Transferencia exitosa', tx });
  } catch (err) {
    res.status(500).json({ message: 'Error interno', error: err });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;

  const transactions = await txRepo.find({
    where: [{ sender: { id: user.id } }, { receiver: { id: user.id } }],
    relations: ['sender', 'receiver'],
    order: { createdAt: 'DESC' },
  });

  res.json(transactions);
};

export const getTransactionById = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;
  const { id } = req.params;

  const tx = await txRepo.findOne({
    where: { id },
    relations: ['sender', 'receiver'],
  });

  if (!tx || (tx.sender.id !== user.id && tx.receiver.id !== user.id)) {
    res.status(403).json({ message: 'Acceso denegado' });
    return;
  }

  res.json(tx);
};
