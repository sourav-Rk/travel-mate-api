import mongoose from "mongoose";

import { IPostLikeModel } from "../models/post-like.model";

export const postLikeSchema = new mongoose.Schema<IPostLikeModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
      required: true,
      index: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "volunteer_posts",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate likes
postLikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

// Index for finding all likes by a user
postLikeSchema.index({ userId: 1 });

// Index for finding all likes for a post
postLikeSchema.index({ postId: 1 });












