import { INotificationEntity } from "../../modelsEntity/notification.entity";

export interface INotificationRepository {
    findById(id : string) : Promise<INotificationEntity | null>;
    createNotification(data : INotificationEntity) : Promise<INotificationEntity>;
    getUserNotifications(userId : string) : Promise<INotificationEntity[]>;
    markAsRead(notificationId : string) : Promise<INotificationEntity | null>;
    markAsReadAll(userId : string) : Promise<void>;
}