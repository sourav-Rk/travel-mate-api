import { inject, injectable } from "tsyringe";
import { INotificationUsecase } from "../../entities/useCaseInterfaces/notification/notification-usecase.interface";
import { IFCMTokenRepository } from "../../entities/repositoryInterfaces/fcmToken/fcmTokenRepository.interface";
import { IPushNotificationService } from "../../entities/serviceInterfaces/push-notifications.interface";

@injectable()
export class NotificationUsecase implements INotificationUsecase{
     constructor(
        @inject('IFCMTokenRepository')
        private _fcmTokenRepository : IFCMTokenRepository,

        @inject('IPushNotificationService')
        private _pushNotificationService : IPushNotificationService
     ){}

     async sendNotification(userId: string, title: string, body: string): Promise<void> {
         
          await this._pushNotificationService.sendNotification(userId,title,body)
     }
}  