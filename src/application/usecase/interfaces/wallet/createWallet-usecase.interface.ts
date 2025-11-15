import { IWalletEntity } from "../../../../domain/entities/wallet.entity";
import { TRole } from "../../../../shared/constants";

export interface ICreateWalletUsecase {
  execute(
    userId: string,
    userType: TRole,
    currency: string
  ): Promise<IWalletEntity>;
}
