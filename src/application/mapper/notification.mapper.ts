import { INotificationEntity } from "../../domain/entities/notification.entity";
import { INotificationModel } from "../../infrastructure/database/models/notification.model";

export class NotificationMapper {
  static toEntity(doc: INotificationModel): INotificationEntity {
    return {
      _id: String(doc._id),
      userId: String(doc.userId),
      message: doc.message,
      title: doc.title,
      type: doc.type,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
      metadata: doc.metadata ?? "",
    };
  }
}
