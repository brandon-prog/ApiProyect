import express from 'express';
import 'dotenv/config';
import { AppDataSource } from './config/data-source'; 
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

export default app;
