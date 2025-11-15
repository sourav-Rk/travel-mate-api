import mongoose from "mongoose";

import { GENDER, ROLES } from "../../../shared/constants";
import { IClientModel } from "../models/client.model";

export const clientSchema = new mongoose.Schema<IClientModel>(
  {
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
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    googleId: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isLocalGuide: {
      type: Boolean,
      default: false,
      index: true,
    },
    localGuideProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "local_guide_profiles",
      default: null,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);
