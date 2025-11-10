export interface MediaAttachment {
  url: string;
  publicId: string;
  type: "image" | "video" | "file" | "voice";
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string; // For videos
  duration?: number; // For voice messages and videos (in seconds)
}

export interface IMessageEntity {
  _id: string;
  chatRoomId: string;
  senderId: string;
  senderType: "client" | "guide" | "vendor";
  receiverId: string;
  recieverType: "client" | "guide" | "vendor";
  status: "sent" | "delivered" | "read";
  readAt?: Date;
  message: string; 
  mediaAttachments?: MediaAttachment[];
  messageType: "text" | "media" | "mixed"; 
  contextType: "vendor_client" | "guide_client" | "client_client";
  contextId?: string;
  deliveredTo?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
