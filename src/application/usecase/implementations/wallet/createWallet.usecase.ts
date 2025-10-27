import { inject, injectable } from "tsyringe";

import { IWalletEntity } from "../../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { TRole } from "../../../../shared/constants";
import { ICreateWalletUsecase } from "../../interfaces/wallet/createWallet-usecase.interface";

@injectable()
export class CreateWalletUsecase implements ICreateWalletUsecase {
  constructor(
    @inject("IWalletRepository")
    private _walletRepository: IWalletRepository
  ) {}

  async execute(
    userId: string,
    userType: TRole,
    currency: string
  ): Promise<IWalletEntity> {
    const existing = await this._walletRepository.findByUserId(userId);

    if (existing) {
      return existing;
    }

    return this._walletRepository.save({ userId, userType, currency });
  }
}
