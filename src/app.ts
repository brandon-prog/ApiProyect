import express from 'express';
import 'dotenv/config';

import { AppDataSource } from './config/data-source'; 
import { initMailer } from './config/mail';          

import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';

export async function createApp() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  }

  try {
    await initMailer();
    console.log('✅ Mailer initialized');
  } catch (err) {
    console.error('❌ Mailer init error:', err);
    process.exit(1);
  }

  const app = express();
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/transactions', transactionRoutes);

  return app;
}

