import mongoose from "mongoose";
import { IItineraryModel } from "../models/itinerary.model";
import { IDay, IMeals } from "../../../entities/modelsEntity/itinerary.entity";

const mealsSchema = new mongoose.Schema<IMeals>({
  breakfast: {
    type: Boolean,
    default: false,
  },
  lunch: {
    type: Boolean,
    default: false,
  },
  dinner: {
    type: Boolean,
    default: false,
  },
});

const daySchema = new mongoose.Schema<IDay>({
  dayNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "activities" }],
  accommodation: {
    type: String,
  },
  transfers: {
    type: [String],
    default: [],
  },
  meals: {
    type: mealsSchema,
    required: true,
  },
});

export const itinerarySchema = new mongoose.Schema<IItineraryModel>(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "packages",
      required: true,
    },
    days: {
      type: [daySchema],
      required: true,
      validate: {
        validator: (days: any[]) => days.length > 0,
        message: "At least one day must be provided in the itinerary",
      },
    },
  },
  {
    timestamps: true,
  }
);
