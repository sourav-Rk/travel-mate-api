import { IFCMTokenEntity } from "../../domain/entities/fcmToken.entity";
import { IFcmTokenModel } from "../../infrastructure/database/models/fcmToken.model";

export class FcmTokenMapper {
  static toEntity(doc: IFcmTokenModel): IFCMTokenEntity {
    return {
      _id: String(doc._id),
      userId: String(doc.userId),
      token: doc.token,
      createdAt: doc.createdAt,
    };
  }
}
