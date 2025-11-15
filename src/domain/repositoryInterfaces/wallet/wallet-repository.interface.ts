import { IWalletEntity } from "../../entities/wallet.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IWalletRepository extends IBaseRepository<IWalletEntity> {
  findByUserId(userId: string): Promise<IWalletEntity | null>;
  updateByUserId(userId : string,data : Partial<IWalletEntity>) : Promise<IWalletEntity | null>;
}
