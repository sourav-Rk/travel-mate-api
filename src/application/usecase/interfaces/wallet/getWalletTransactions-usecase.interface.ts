import { TRANSACTION_TYPE_FILTER } from "../../../../shared/constants";
import { PaginatedWalletTransactions } from "../../../dto/response/walletDto";

export interface IGetWalletTransactionsUsecase {
  execute(
    walletId: string,
    page: number,
    limit: number,
    type : TRANSACTION_TYPE_FILTER,
    searchTerm:string,
    sortby : "newest" | "oldest"
  ): Promise<PaginatedWalletTransactions>;
}
