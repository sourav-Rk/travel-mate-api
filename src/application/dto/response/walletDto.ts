import { IWalletTransactionEntity } from "../../../domain/entities/walletTransactions.entity";

export interface PaginatedWalletTransactions {
  data: IWalletTransactionEntity[];
  total: number;
}

export interface GetWalletDto {
  _id: string;
  userId: string;
  userType: string;
  balance: number;
}
