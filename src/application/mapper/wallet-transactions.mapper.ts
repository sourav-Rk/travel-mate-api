import { IWalletTransactionEntity } from "../../domain/entities/walletTransactions.entity";
import { IWalletTransactionsModel } from "../../infrastructure/database/models/walletTransactions.model";

export class WalletTransactionsMapper {
  static toEntity(doc: IWalletTransactionsModel): IWalletTransactionEntity {
    return {
      _id: String(doc._id),
      walletId: String(doc.walletId),
      amount: doc.amount,
      type: doc.type,
      description: doc.description,
      referenceId: doc.referenceId,
      metadata: doc.metadata,
    };
  }
}
