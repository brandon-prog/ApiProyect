"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionById = exports.getTransactions = exports.makeTransfer = void 0;
const db_1 = require("../config/db");
const Transaction_1 = require("../entities/Transaction");
const User_1 = require("../entities/User");
const txRepo = db_1.AppDataSource.getRepository(Transaction_1.Transaction);
const userRepo = db_1.AppDataSource.getRepository(User_1.User);
const makeTransfer = async (req, res) => {
    const sender = req.user;
    const { account_number, amount } = req.body;
    try {
        const receiver = await userRepo.findOneBy({ account_number });
        if (!receiver)
            return res.status(404).json({ message: 'Cuenta destino no encontrada' });
        if (sender.id === receiver.id)
            return res.status(400).json({ message: 'No puedes transferirte a ti mismo' });
        if (sender.balance < amount)
            return res.status(400).json({ message: 'Fondos insuficientes' });
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
        order: { transaction_date: 'DESC' },
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
    if (!tx || (tx.sender.id !== user.id && tx.receiver.id !== user.id))
        return res.status(403).json({ message: 'Acceso denegado' });
    res.json(tx);
};
exports.getTransactionById = getTransactionById;
