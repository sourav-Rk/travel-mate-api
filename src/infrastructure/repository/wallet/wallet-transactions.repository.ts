import { injectable } from "tsyringe";
import { BaseRepository } from "../baseRepository";
import {
  IWalletTransactionsModel,
  walletTransactionsDB,
} from "../../database/models/walletTransactions.model";
import { IWalletTransactionEntity } from "../../../domain/entities/walletTransactions.entity";
import { IWalletTransactionsRepository } from "../../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import { WalletTransactionsMapper } from "../../../application/mapper/wallet-transactions.mapper";
import { PaginatedWalletTransactions } from "../../../application/dto/response/walletDto";
import { TRANSACTION_TYPE_FILTER } from "../../../shared/constants";

@injectable()
export class WalletTransactionsRepository
  extends BaseRepository<IWalletTransactionsModel, IWalletTransactionEntity>
  implements IWalletTransactionsRepository
{
  constructor() {
    super(walletTransactionsDB, WalletTransactionsMapper.toEntity);
  }

  async getWalletTransactions(
    walletId: string,
    page = 1,
    limit = 10,
    type: TRANSACTION_TYPE_FILTER,
    searchTerm: string,
    sortby: "newest" | "oldest"
  ): Promise<PaginatedWalletTransactions> {
    const skip = (page - 1) * limit;
    const filter: any = { walletId };

    if (type && type !== "all") {
      filter.type = type;
    }

    const sortBy: any = {};

    if (sortby === "oldest") {
      sortBy.createdAt = 1;
    } else {
      sortBy.createdAt = -1;
    }
    if (searchTerm) {
      filter.$or = [
        { referenceId: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];

      const amountNumber = Number(searchTerm);
      if (!isNaN(amountNumber)) {
        filter.$or.push({ amount: amountNumber });
      }
    }

    const [wallet, total] = await Promise.all([
       walletTransactionsDB
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit),
       walletTransactionsDB.countDocuments(filter),
    ]);

    const data = wallet.map((w) => WalletTransactionsMapper.toEntity(w));

    return {
      data,
      total,
    };
  }
}
