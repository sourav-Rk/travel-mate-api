import mongoose from "mongoose";
import { IFcmTokenModel } from "../models/fcmToken.model";
import { ROLES } from "../../../shared/constants";

export const fcmTokenSchema = new mongoose.Schema<IFcmTokenModel>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
