export interface IGroupChatEntity {
  _id: string;
  packageId: string;
  name: string;
  members: {
    userId: string;
    userType: "client" | "guide" | "vendor";
  }[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}