import mongoose from "mongoose";
import { IWalletTransactionsModel } from "../models/walletTransactions.model";
import { TRANSACTION_TYPE } from "../../../shared/constants";

export const walletTransactionsSchema = new mongoose.Schema<IWalletTransactionsModel>(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wallets",
      required: true,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPE,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    referenceId: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);
