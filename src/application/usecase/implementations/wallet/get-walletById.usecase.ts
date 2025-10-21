import { inject, injectable } from "tsyringe";
import { IGetWalletByIdUsecase } from "../../interfaces/wallet/get-walletById-usecase.interface";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { GetWalletDto } from "../../../dto/response/walletDto";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { WalletMapper } from "../../../mapper/wallet.mapper";

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
