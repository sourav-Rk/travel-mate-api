import { injectable } from "tsyringe";
import { IFCMTokenRepository } from "../../../entities/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";
import {
  fcmTokenDb,
  IFcmTokenModel,
} from "../../../frameworks/database/models/fcmToken.model";
import { IFCMTokenEntity } from "../../../entities/modelsEntity/fcmToken.entity";
import { FcmTokenMapper } from "../../mappers/fcmToken.mapper";

@injectable()
export class FCMTokenRepository implements IFCMTokenRepository {
  async createFcmToken(
    userId: string,
    token: string
  ): Promise<void> {
    console.log(userId,token)
    await fcmTokenDb.findOneAndUpdate(
      { userId,},
      { token },
      { upsert: true, new: true }
    );
  }

  async delete(userId: string): Promise<void> {
    await fcmTokenDb.deleteOne({ userId });
  }

  async findByUserIdAndRole(
    userId: string,
  ): Promise<IFCMTokenEntity[]> {
    const modelData = await fcmTokenDb.find({ userId });
    return modelData
      ? modelData.map((doc) => FcmTokenMapper.toEntity(doc))
      : [];
  }
}
