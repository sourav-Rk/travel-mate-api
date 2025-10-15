import { IMessageEntity } from "../../../../domain/entities/message.entity";

export interface ISendMessageUseCase {
  execute(data: {
    chatRoomId: string;
    senderId: string;
    senderType: "client" | "guide" | "vendor";
    receiverId: string;
    receiverType: "client" | "guide" | "vendor";
    message: string;
    contextType: "vendor_client" | "guide_client" | "client_client";
    contextId : string;
  }): Promise<IMessageEntity>;
}