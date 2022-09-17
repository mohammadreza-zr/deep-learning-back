import { Document } from 'mongoose';
import { Rule } from '../dto';

export interface AuthInterface extends Document {
  id?: string;
  fullName?: string;
  email: string;
  emailVerified?: boolean;
  emailVerifyCode?: number;
  password: string;
  rule?: Rule;
  createdAt?: string;
}
