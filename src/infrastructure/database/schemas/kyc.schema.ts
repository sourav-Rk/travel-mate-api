import mongoose from "mongoose";

import { IKycModel } from "../models/kyc.model";

export const kycSchema = new mongoose.Schema<IKycModel>(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendors",
      required: true,
    },
    pan: {
      type: String,
      required: true,
    },
    gstin: {
      type: String,
      required: true,
    },
    documents: {
      type: [String],
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
