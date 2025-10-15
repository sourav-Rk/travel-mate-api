export interface IChatRoomEntity {
  _id: string;
  participants: {
    userId: string;
    userType: "client" | "guide" | "vendor";
  }[];
  contextType: "vendor_client" | "guide_client" | "client_client";
  contextId ?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
