import mongoose from 'mongoose';

export const DatasetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  hashtag: {
    type: Array,
  },
  author: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
  },
  imageUrl: {
    type: String,
    required: true,
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
