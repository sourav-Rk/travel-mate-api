import mongoose from "mongoose";
import { IPackageModel } from "../models/package.model";

const durationSchema = new mongoose.Schema({
  days: {
    type: Number,
  },
  nights: {
    type: Number,
  },
});

export const packageSchema = new mongoose.Schema<IPackageModel>(
  {
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendors",
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    status: {
      type: String,
      required: true,
    },
    meetingPoint: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cancellationPolicy: {
      type: String,
      required: true,
    },
    termsAndConditions: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: durationSchema,
    },
    itineraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "itinerarys",
    },
    exclusions: {
      type: [String],
    },
    inclusions: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
