import { IMessageEntity, MediaAttachment } from "../../../../domain/entities/message.entity";
import { CHAT_CONTEXT_TYPE, CHAT_USERS } from "../../../../shared/constants";

export interface ISendMessageUseCase {
  execute(data: {
    chatRoomId?: string;
    senderId: string;
    senderType: CHAT_USERS
    receiverId: string;
    receiverType: CHAT_USERS
    message: string;
    mediaAttachments?: MediaAttachment[];
    contextType: CHAT_CONTEXT_TYPE
    contextId: string;
  }): Promise<IMessageEntity>;
}