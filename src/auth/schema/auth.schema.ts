import mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 350,
  },
  role: {
    type: String,
    default: 'USER',
    enum: ['SUPER_ADMIN', 'ADMIN', 'USER'],
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  updatedAt: {
    type: Number,
    default: Date.now(),
  },
});
