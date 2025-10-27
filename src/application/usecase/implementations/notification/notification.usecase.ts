import { inject, injectable } from "tsyringe";

import { IFCMTokenRepository } from "../../../../domain/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";
import { IPushNotificationService } from "../../../../domain/service-interfaces/push-notifications.interface";
import { INotificationUsecase } from "../../interfaces/notification/notification-usecase.interface";

@injectable()
export class NotificationUsecase implements INotificationUsecase {
  constructor(
    @inject("IFCMTokenRepository")
    private _fcmTokenRepository: IFCMTokenRepository,

    @inject("IPushNotificationService")
    private _pushNotificationService: IPushNotificationService
  ) {}

  async sendNotification(
    userId: string,
    title: string,
    body: string
  ): Promise<void> {
    await this._pushNotificationService.sendNotification(userId, title, body);
  }
}
