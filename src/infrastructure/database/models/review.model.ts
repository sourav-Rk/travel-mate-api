import mongoose, { Document, ObjectId } from "mongoose";

import { IReviewEntity } from "../../../domain/entities/review.entity";
import { reviewSchema } from "../schemas/review.schema";

export interface IReviewModel
  extends Omit<IReviewEntity, "_id" | "userId">,
    Document {
  userId: ObjectId;
}

export const reviewDB = mongoose.model<IReviewModel>("reviews", reviewSchema);
