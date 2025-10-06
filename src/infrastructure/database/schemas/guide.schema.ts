import mongoose from "mongoose";

import { GENDER, ROLES } from "../../../shared/constants";
import { IGuideModel } from "../models/guide.model";

export const guideSchema = new mongoose.Schema<IGuideModel>(
  {
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendors",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    alternatePhone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    dob: {
      type: Date,
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    yearOfExperience: {
      type: String,
      default: null,
    },
    languageSpoken: {
      type: [String],
      default: [],
    },
    documents: {
      type: [String],
      default: null,
    },
    assignedTrips: {
      type: [String],
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
