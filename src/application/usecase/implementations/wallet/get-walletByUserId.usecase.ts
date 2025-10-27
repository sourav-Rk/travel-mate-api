import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { ERROR_MESSAGE, TRole } from "../../../../shared/constants";
import { GetWalletDto } from "../../../dto/response/walletDto";
import { WalletMapper } from "../../../mapper/wallet.mapper";
import { IGetWalletByUserIdUsecase } from "../../interfaces/wallet/get-walletByUserId-usecase.interface";

@injectable()
export class GetWalletByUserIdUsecase implements IGetWalletByUserIdUsecase {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository
  ) {}

  async execute(userId: string,role : TRole): Promise<GetWalletDto> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet) {
      await this._walletRepository.save({userId,userType:role})
    }

    return WalletMapper.mapToGetWalletDto(wallet!);
  }
}
