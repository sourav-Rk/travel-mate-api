import mongoose, { Document } from "mongoose";

import { IWalletTransactionEntity } from "../../../domain/entities/walletTransactions.entity";
import { walletTransactionsSchema } from "../schemas/walletTransaction.schema";

export interface IWalletTransactionsModel
  extends Omit<IWalletTransactionEntity, "_id" | "walletId">,
    Document {
  _id: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
}
export const walletTransactionsDB = mongoose.model("walletTransactions",walletTransactionsSchema);
