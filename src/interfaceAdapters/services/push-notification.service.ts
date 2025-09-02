import { inject, injectable } from "tsyringe";
import { IFCMTokenRepository } from "../../entities/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";
import { IPushNotificationService } from "../../entities/serviceInterfaces/push-notifications.interface";
import { FirebaseAdminConfig } from "../../frameworks/firebase/firebaseAdmin";
import { logger } from "../../frameworks/logger/winston.logger";

@injectable()
export class PushNotificationService implements IPushNotificationService {
  constructor(
    @inject("IFCMTokenRepository")
    private _fcmTokenRepository: IFCMTokenRepository
  ) {}

  async sendNotification(
    userId: string,
    title: string,
    body: string
  ): Promise<void> {
    const userTokens = await this._fcmTokenRepository.findByUserIdAndRole(
      userId
    );

    console.log(userTokens, "found");
    if (!userTokens.length) {
      console.log("no fcm tokens found for user");
      return;
    }

    const tokens = userTokens.map((ut) => ut.token);

    console.log(tokens, "tokens");

    const message = {
      notification: { title, body },
      tokens: tokens,
    };

    const admin = FirebaseAdminConfig.getInstance();

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(response, "success");
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  }
}
