import { Document } from 'mongoose';
import { Role } from '../../types';

export interface AuthInterface extends Document {
  id?: string;
  fullName?: string;
  email: string;
  emailVerified?: boolean;
  emailVerifyCode?: number;
  password: string;
  role?: Role;
  createdAt?: number;
  updatedAt?: number;
}
