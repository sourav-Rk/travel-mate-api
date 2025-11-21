export interface GuideChatParticipant {
  userId: string;
  role: "client" | "guide";
}

export interface IGuideChatRoomEntity {
  _id?: string;
  roomKey: string;
  participants: GuideChatParticipant[];
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










