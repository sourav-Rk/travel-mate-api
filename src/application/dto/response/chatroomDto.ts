
export interface ChatRoomDTO {
  _id: string;
  participants: Participants[];
  contextType: "vendor_client" | "guide_client" | "client_client";
  contextId?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Participants = {
  userId: string;
  userType: "client" | "guide" | "vendor";
};

export interface ChatRoomFindDto {
  participants: Participants[];
  contextType: string;
}

export interface PeerDTO {
  userId: string;
  userType: "client" | "guide" | "vendor";
}

export interface PeerInfoDTO {
  firstName: string;
  profileImage?: string;
}

export interface ChatListItemDTO {
  roomId: string;
  peer: PeerDTO;
  peerInfo: PeerInfoDTO;
  contextType: "vendor_client" | "guide_client" | "client_client";
  contextId?: string;
  lastMessage?: string;
  lastMessageStatus?: "sent" | "delivered" | "read";
  lastMessageReadAt?: string;
  lastMessageAt?: string;
}

export interface ChatListResponseDTO {
  chats: ChatListItemDTO[];
}
