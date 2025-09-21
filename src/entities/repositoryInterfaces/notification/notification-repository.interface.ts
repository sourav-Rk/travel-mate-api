import { INotificationEntity } from "../../modelsEntity/notification.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface INotificationRepository extends IBaseRepository<INotificationEntity> {
    createNotification(data : INotificationEntity) : Promise<INotificationEntity>;
    getUserNotifications(userId : string) : Promise<INotificationEntity[]>;
    markAsRead(notificationId : string) : Promise<INotificationEntity | null>;
    markAsReadAll(userId : string) : Promise<void>;
}