import { injectable } from "tsyringe";
import { INotificationRepository } from "../../../domain/repositoryInterfaces/notification/notification-repository.interface";
import { INotificationEntity } from "../../../domain/entities/notification.entity";
import {
  INotificationModel,
  notificationDB,
} from "../../database/models/notification.model";
import { NotificationMapper } from "../../../application/mapper/notification.mapper";
import { BaseRepository } from "../baseRepository";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotificationModel, INotificationEntity>
  implements INotificationRepository
{
  constructor() {
    super(notificationDB, NotificationMapper.toEntity);
  }

  async createNotification(
    data: INotificationEntity
  ): Promise<INotificationEntity> {
    const modelData = await notificationDB.create(data);
    return NotificationMapper.toEntity(modelData);
  }

  async getUserNotifications(userId: string): Promise<INotificationEntity[]> {
    const modelData = await notificationDB
      .find({ userId })
      .sort({ createdAt: -1 });
    return modelData.map((doc) => NotificationMapper.toEntity(doc));
  }

  async markAsRead(
    notificationId: string
  ): Promise<INotificationEntity | null> {
    const modelData = await notificationDB.findOneAndUpdate(
      { _id: notificationId },
      {
        isRead: true,
      },
      { new: true }
    );

    return modelData ? NotificationMapper.toEntity(modelData) : null;
  }

  async markAsReadAll(userId: string): Promise<void> {
    await notificationDB.updateMany({ userId }, { $set: { isRead: true } });
  }
}
