import mongoose from "mongoose";

import { ROLES, STATUS } from "../../../shared/constants";
import { IVendorModel } from "../models/vendor.model";

export const vendorSchema = new mongoose.Schema<IVendorModel>(
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
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    agencyName: {
      type: String,
    },
    description: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: STATUS,
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
