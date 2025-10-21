import { inject, injectable } from "tsyringe";
import { ICreateWalletUsecase } from "../../interfaces/wallet/createWallet-usecase.interface";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletEntity } from "../../../../domain/entities/wallet.entity";
import { TRole } from "../../../../shared/constants";

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
