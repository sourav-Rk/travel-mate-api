import mongoose from "mongoose";
import { IReviewModel } from "../models/review.model";

export const reviewSchema = new mongoose.Schema<IReviewModel>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "clients",
      required : true
    },
    targetType: {
      type : String,
      enum: ["guide", "package"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    packageId: {
      type: String,
    },
    guideId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
