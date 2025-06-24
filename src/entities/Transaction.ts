import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @ManyToOne(() => User, user => user.sent, { eager: true })
  sender!: User;

  @Index()
  @ManyToOne(() => User, user => user.received, { eager: true })
  receiver!: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: string; 
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
