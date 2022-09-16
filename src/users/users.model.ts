import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    maxLength: 250,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 350,
    trim: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerifyCode: {
    type: Number,
    maxLength: 8,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 350,
  },
  rule: {
    type: String,
    default: 'USER',
    enum: ['SUPER_ADMIN', 'ADMIN', 'USER'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export enum Rule {
  'SUPER_ADMIN' = 'SUPER_ADMIN',
  'ADMIN' = 'ADMIN',
  'USER' = 'USER',
}

export interface Users extends mongoose.Document {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  emailVerifyCode: number;
  password: string;
  rule: Rule;
  createdAt: string;
}
