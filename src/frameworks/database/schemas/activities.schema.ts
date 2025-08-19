import mongoose from "mongoose";
import { IActivitiesModel } from "../models/acitivities.model";

export const activitiesSchema = new mongoose.Schema<IActivitiesModel>(
  {
    name: {
      type: String,
      required: true,
    },
    dayNumber : {
      type : Number,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    category: {
      type: String,
    },
    priceIncluded: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
