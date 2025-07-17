import mongoose from "mongoose";
import { IVendorModel } from "../models/vendor.model";
import { ROLES, STATUS } from "../../../shared/constants";

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
      required: true,
    },
    password: {
      type: String,
      required: true,
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
      required: true,
    },
    description: {
      type: String,
      default : null
    },
    profileImage: {
      type : String,
      default: null,
    },
    status: {
      type: String,
      enum: STATUS,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
