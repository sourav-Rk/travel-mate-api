export interface IGroupMessageEntity {
  _id: string;
  groupChatId: string;
  senderId: string;
  senderType: "client" | "guide" | "vendor";
  message: string;
  status: "sent" | "delivered" | "read";
  createdAt: Date;
  updatedAt: Date;
}