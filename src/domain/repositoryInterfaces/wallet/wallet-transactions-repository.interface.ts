import { PaginatedWalletTransactions } from "../../../application/dto/response/walletDto";
import {  TRANSACTION_TYPE_FILTER } from "../../../shared/constants";
import { IWalletTransactionEntity } from "../../entities/walletTransactions.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IWalletTransactionsRepository
  extends IBaseRepository<IWalletTransactionEntity> {
  getWalletTransactions(
    walletId: string,
    page: number,
    limit: number,
    type: TRANSACTION_TYPE_FILTER,
    searchTerm: string,
    sortby: "newest" | "oldest"
  ): Promise<PaginatedWalletTransactions>;
}
