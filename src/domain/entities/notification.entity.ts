import { MetadataValue } from "../../shared/constants";

export interface INotificationEntity {
  _id?: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: Record<string, MetadataValue>;
  createdAt?: Date;
}
