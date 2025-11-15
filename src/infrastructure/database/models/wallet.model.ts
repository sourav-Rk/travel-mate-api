import mongoose, { Document } from "mongoose";

import { IWalletEntity } from "../../../domain/entities/wallet.entity";
import { walletSchema } from "../schemas/wallet.schema";


export interface IWalletModel
  extends Omit<IWalletEntity, "_id"|"userId">,
    Document {
  _id: mongoose.Types.ObjectId;
  userId : mongoose.Types.ObjectId;
}
export const walletDB = mongoose.model("wallets",walletSchema)