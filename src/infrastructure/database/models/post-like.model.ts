import mongoose, { Document, ObjectId } from "mongoose";

import { IPostLikeEntity } from "../../../domain/entities/post-like.entity";
import { postLikeSchema } from "../schemas/post-like.schema";

export interface IPostLikeModel
  extends Omit<IPostLikeEntity, "_id" | "userId" | "postId">,
    Document {
  _id: ObjectId;
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
}

export const postLikeDB = mongoose.model<IPostLikeModel>(
  "post_likes",
  postLikeSchema
);


















