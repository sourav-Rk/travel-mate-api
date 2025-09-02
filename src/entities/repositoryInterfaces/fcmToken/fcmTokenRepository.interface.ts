import { IFCMTokenEntity } from "../../modelsEntity/fcmToken.entity";

export interface IFCMTokenRepository {
  createFcmToken(userId: string, token: string): Promise<void>;
  delete(userId: string): Promise<void>;
  findByUserIdAndRole(userId : string) : Promise<IFCMTokenEntity[]>;
  // getTokenByUser(userId: string): Promise<IFCMTokenEntity | null>;
  // getTokenByRole(role: string): Promise<IFCMTokenEntity>;
}
