import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  facebookId?: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  @CreateDateColumn()
  createdAt: Date = new Date();

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
