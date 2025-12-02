import { Document, Types } from 'mongoose';
import { UserResponse } from './user.types';

/**
 * Post document interface for Mongoose
 */
export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  imageUrl: string;
  imageKey: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Populated post with author details
 */
export interface IPostPopulated extends Omit<IPost, 'author'> {
  author: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
}

/**
 * Create post DTO
 */
export interface CreatePostDTO {
  title: string;
  content: string;
  imageUrl: string;
  imageKey: string;
  author: string;
}

/**
 * Update post DTO
 */
export interface UpdatePostDTO {
  title?: string;
  content?: string;
  imageUrl?: string;
  imageKey?: string;
}

/**
 * Post response format
 */
export interface PostResponse {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Post list query parameters
 */
export interface PostListQuery {
  page?: number;
  limit?: number;
  author?: string;
}

