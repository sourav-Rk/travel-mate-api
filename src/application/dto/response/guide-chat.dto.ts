import { QuoteMessagePayload } from "./local-guide-booking.dto";

export interface GuideChatParticipantDto {
  userId: string;
  role: "client" | "guide";
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

export interface GuideChatRoomDto {
  _id: string;
  roomKey: string;
  participants: GuideChatParticipantDto[];
  latestContext?: {
    guideProfileId?: string;
    postId?: string;
    bookingId?: string;
  };
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GuideMessageDto {
  _id: string;
  guideChatRoomId: string;
  senderId: string;
  senderRole: "client" | "guide";
  messageType: "text" | "media" | "system" | "quote";
  message?: string;
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
  deliveredTo?: string[];
  readBy?: string[];
  metadata?: QuoteMessagePayload;
  createdAt: Date;
  updatedAt: Date;
}


