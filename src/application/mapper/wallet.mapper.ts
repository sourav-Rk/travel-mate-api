import { IWalletEntity } from "../../domain/entities/wallet.entity";
import { IWalletModel } from "../../infrastructure/database/models/wallet.model";
import { GetWalletDto } from "../dto/response/walletDto";

export class WalletMapper {
  static toEnity(doc: IWalletModel): IWalletEntity {
    return {
      _id: String(doc._id),
      userId: String(doc.userId),
      userType: doc.userType,
      balance: Number(doc.balance),
      currency: doc.currency,
    };
  }

  static mapToGetWalletDto(doc : IWalletEntity ) : GetWalletDto{
    return {
      _id : String(doc._id),
      balance : Number(doc.balance),
      userId : String(doc.userId),
      userType : doc.userType
    }
  }
}
