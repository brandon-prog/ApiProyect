import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Transaction } from './Transaction';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  account_number!: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance!: number;

  @Column({ default: false })
  isEmailVerified!: boolean;  
  @OneToMany(() => Transaction, tx => tx.sender)
  sent!: Transaction[];

  @OneToMany(() => Transaction, tx => tx.receiver)
  received!: Transaction[];
}
