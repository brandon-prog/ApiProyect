import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Transaction } from '../entities/Transaction';
import { envs } from './envs';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envs.DATABASE_HOST,
  port: envs.DATABASE_PORT,
  username: envs.DATABASE_USERNAME,
  password: envs.DATABASE_PASSWORD,
  database: envs.DATABASE_NAME,
  synchronize: true, 
  logging: false,
  entities: [User, Transaction],
});
