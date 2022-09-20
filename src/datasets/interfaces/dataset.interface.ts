import { Document } from 'mongoose';

export interface DatasetInterface extends Document {
  id?: string;
  title: string;
  body: string;
  author: string;
  hashtag: string[];
  views: number;
  imageUrl: string;
  createdAt?: number;
  updatedAt?: number;
}
