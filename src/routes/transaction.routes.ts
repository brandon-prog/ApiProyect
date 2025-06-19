import { Router } from 'express';
import {
  makeTransfer,
  getTransactions,
  getTransactionById
} from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, makeTransfer);
router.get('/', authMiddleware, getTransactions);
router.get('/:id', authMiddleware, getTransactionById);

export default router;
