import { injectable } from "tsyringe";

import { WalletMapper } from "../../../application/mapper/wallet.mapper";
import { IWalletEntity } from "../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../domain/repositoryInterfaces/wallet/wallet-repository.interface";
import { IWalletModel, walletDB } from "../../database/models/wallet.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class WalletRepository
  extends BaseRepository<IWalletModel, IWalletEntity>
  implements IWalletRepository
{
  constructor() {
    super(walletDB, WalletMapper.toEnity);
  }

  async findByUserId(userId: string): Promise<IWalletEntity | null> {
    return await walletDB.findOne({ userId });
  }

  async updateByUserId(
    userId: string,
    data: Partial<IWalletEntity>
  ): Promise<IWalletEntity | null> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    const wallet = await walletDB.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true }
    );

    if (!wallet) {
      return null;
    }

    return WalletMapper.toEnity(wallet);
  }
}
