export interface INotificationEntity {
  _id ?: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: any;
  createdAt?: Date;
}
