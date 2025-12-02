import mongoose, { Schema } from 'mongoose';
import { IPost } from '../types/post.types';

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    imageKey: {
      type: String,
      required: [true, 'Image key is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
  },
  {
    timestamps: true,
  }
);


postSchema.index({ author: 1 });
postSchema.index({ createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema);

