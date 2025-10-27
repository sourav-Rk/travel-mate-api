import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { GetWalletDto } from "../../../dto/response/walletDto";
import { WalletMapper } from "../../../mapper/wallet.mapper";
import { IGetWalletByIdUsecase } from "../../interfaces/wallet/get-walletById-usecase.interface";

@injectable()
export class GetWalletByIdUsecase implements IGetWalletByIdUsecase {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository
  ) {}

  async execute(walletId: string): Promise<GetWalletDto> {
    if (!walletId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const wallet = await this._walletRepository.findById(walletId);

    if (!wallet) {
      throw new NotFoundError(ERROR_MESSAGE.WALLET_NOT_FOUND);
    }

    return WalletMapper.mapToGetWalletDto(wallet);
  }
}
