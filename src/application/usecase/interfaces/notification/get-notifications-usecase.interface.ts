import { INotificationEntity } from "../../../../domain/entities/notification.entity";

export interface IGetNotificationsUsecase {
  execute(userId: string): Promise<INotificationEntity[]>;
}
