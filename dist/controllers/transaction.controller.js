"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionById = exports.getTransactions = exports.makeTransfer = void 0;
const data_source_1 = require("../config/data-source");
const Transaction_1 = require("../entities/Transaction");
const User_1 = require("../entities/User");
const txRepo = data_source_1.AppDataSource.getRepository(Transaction_1.Transaction);
const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
const makeTransfer = async (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({ message: 'Error interno', error: err });
    }
};
exports.makeTransfer = makeTransfer;
const getTransactions = async (req, res) => {
    const user = req.user;
    const transactions = await txRepo.find({
        where: [{ sender: { id: user.id } }, { receiver: { id: user.id } }],
        relations: ['sender', 'receiver'],
        order: { createdAt: 'DESC' },
    });
    res.json(transactions);
};
exports.getTransactions = getTransactions;
const getTransactionById = async (req, res) => {
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
exports.getTransactionById = getTransactionById;
