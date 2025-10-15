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
  contextType: "vendor_client" | "guide_client" | "client_client";
  contextId?: string;
  deliveredTo?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
