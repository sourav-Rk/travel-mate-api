import mongoose from "mongoose";
import { ROLES } from "../../../shared/constants";
import { IAdminModel } from "../models/admin.model";

export const adminSchema = new mongoose.Schema<IAdminModel>(
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
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
