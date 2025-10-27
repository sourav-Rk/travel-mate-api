import mongoose from "mongoose";

import { ROLES } from "../../../shared/constants";
import { IWalletModel } from "../models/wallet.model";

export const walletSchema = new mongoose.Schema<IWalletModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      default : "INR"
    },
  },
  {
    timestamps: true,
  }
);
