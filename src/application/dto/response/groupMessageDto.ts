import { Expose, Transform } from "class-transformer";

export interface MediaAttachment {
  url: string;
  publicId: string;
  type: "image" | "video" | "file" | "voice";
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string;
  duration?: number;
}

export interface GroupMessageDTO {
  _id: string;
  groupChatId: string;
  senderId: string;
  senderType: "client" | "guide" | "vendor";
  message: string;
  mediaAttachments?: MediaAttachment[];
  messageType: "text" | "media" | "mixed";
  status: "sent" | "delivered" | "read";
  createdAt: Date;
  updatedAt: Date;
}

export class GroupMessageResDTO implements GroupMessageDTO {
  @Transform(({ obj }) => obj._id.toString())
  @Expose()
  _id!: string;

  @Transform(({ obj }) => obj.groupChatId?.toString())
  @Expose()
  groupChatId!: string;

  @Transform(({ obj }) => obj.senderId?.toString())
  @Expose()
  senderId!: string;

  @Expose()
  senderType!: "client" | "guide" | "vendor";

  @Expose()
  message!: string;

  @Expose()
  mediaAttachments?: Array<{
    url: string;
    publicId: string;
    type: "image" | "video" | "file" | "voice";
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnailUrl?: string;
    duration?: number;
  }>;

  @Expose()
  messageType!: "text" | "media" | "mixed";

  @Expose()
  status!: "sent" | "delivered" | "read";

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}

export interface SendGroupMessageDTO {
  groupChatId: string;
  senderId: string;
  senderType: "client" | "guide" | "vendor";
  message: string;
  mediaAttachments?: MediaAttachment[];
}

export interface GetGroupMessagesDTO {
  groupChatId: string;
  limit: number;
  before?: string;
}

export interface PaginatedGroupMessagesDTO {
  messages: GroupMessageDTO[];
  total: number;
  hasMore: boolean;
}

