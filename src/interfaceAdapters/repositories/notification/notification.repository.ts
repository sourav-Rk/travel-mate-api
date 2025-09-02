import { injectable } from "tsyringe";
import { INotificationRepository } from "../../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { INotificationEntity } from "../../../entities/modelsEntity/notification.entity";
import { notificationDB } from "../../../frameworks/database/models/notification.model";
import { NotificationMapper } from "../../mappers/notification.mapper";

@injectable()
export class NotificationRepository implements INotificationRepository {
  async createNotification(
    data: INotificationEntity
  ): Promise<INotificationEntity> {
    const modelData = await notificationDB.create(data);
    return NotificationMapper.toEntity(modelData);
  }

  async findById(id: string): Promise<INotificationEntity | null> {
      return await notificationDB.findById(id);
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
