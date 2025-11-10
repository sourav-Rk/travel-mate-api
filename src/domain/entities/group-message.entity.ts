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

export interface IGroupMessageEntity {
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