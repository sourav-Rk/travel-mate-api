import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletTransactionsRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-transactions-repository.interface";
import { ERROR_MESSAGE, TRANSACTION_TYPE } from "../../../../shared/constants";
import { PaginatedWalletTransactions } from "../../../dto/response/walletDto";
import { IGetWalletTransactionsUsecase } from "../../interfaces/wallet/getWalletTransactions-usecase.interface";

@injectable()
export class GetWalletTransactionsUsecase
  implements IGetWalletTransactionsUsecase
{
  constructor(
    @inject("IWalletTransactionsRepository")
    private _walletTransactionsRepository: IWalletTransactionsRepository,

    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository
  ) {}

  async execute(
    walletId: string,
    page = 1,
    limit = 10,
    type: TRANSACTION_TYPE,
    searchTerm: string,
    sortby: "newest" | "oldest"
  ): Promise<PaginatedWalletTransactions> {
    if (!walletId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const wallet = await this._walletRepository.findById(walletId);

    if (!wallet) {
      throw new NotFoundError(ERROR_MESSAGE.WALLET_NOT_FOUND);
    }

    const validPageNumber = Math.max(1, page || 0);
    const validPageSize = Math.max(1, limit || 0);

    const { data, total } =
      await this._walletTransactionsRepository.getWalletTransactions(
        walletId,
        validPageNumber,
        validPageSize,
        type,
        searchTerm,
        sortby
      );

    return {
      data,
      total: Math.ceil(total / validPageSize)
    };
  }
}
