import { injectable } from "tsyringe";
import { IFCMTokenRepository } from "../../../domain/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";
import {
  fcmTokenDb,
  IFcmTokenModel,
} from "../../database/models/fcmToken.model";
import { IFCMTokenEntity } from "../../../domain/entities/fcmToken.entity";
import { FcmTokenMapper } from "../../../application/mapper/fcmToken.mapper";

@injectable()
export class FCMTokenRepository implements IFCMTokenRepository {
  async createFcmToken(userId: string, token: string): Promise<void> {
    await fcmTokenDb.findOneAndUpdate(
      { userId },
      { token },
      { upsert: true, new: true }
    );
  }

  async delete(userId: string): Promise<void> {
    await fcmTokenDb.deleteOne({ userId });
  }

  async findByUserIdAndRole(userId: string): Promise<IFCMTokenEntity[]> {
    const modelData = await fcmTokenDb.find({ userId });
    return modelData
      ? modelData.map((doc) => FcmTokenMapper.toEntity(doc))
      : [];
  }
}
