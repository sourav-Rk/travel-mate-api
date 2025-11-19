import { QuoteMessagePayload } from "../../application/dto/response/local-guide-booking.dto";

export interface GuideMediaAttachment {
  url: string;
  publicId: string;
  type: "image" | "video" | "file" | "voice";
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string;
  duration?: number;
}

export type GuideMessageType = "text" | "media" | "system" | "quote";

export interface IGuideMessageEntity {
  _id?: string;
  guideChatRoomId: string;
  senderId: string;
  senderRole: "client" | "guide";
  message?: string;
  messageType: GuideMessageType;
  mediaAttachments?: GuideMediaAttachment[];
  deliveredTo?: string[];
  readBy?: string[];
  metadata?: QuoteMessagePayload
  createdAt?: Date;
  updatedAt?: Date;
}


