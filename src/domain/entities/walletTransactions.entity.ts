import {
  MetadataValue,
  TRANSACTION_TYPE,
} from "../../shared/constants";

export interface IWalletTransactionEntity {
  _id: string;
  walletId: string;
  type: TRANSACTION_TYPE;
  amount: number;
  description?: string;
  referenceId?: string;
  metadata?: Record<string, MetadataValue>;
  createdAt?: Date;
}
