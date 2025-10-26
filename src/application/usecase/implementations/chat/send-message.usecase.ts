import { inject, injectable } from "tsyringe";
import { ISendMessageUseCase } from "../../interfaces/chat/send-message-usecase.interface";
import { IMessageRepository } from "../../../../domain/repositoryInterfaces/message/message-repository.interface";
import { IMessageEntity } from "../../../../domain/entities/message.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { CHAT_CONTEXT_TYPE, CHAT_USERS, ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IChatRoomRepository } from "../../../../domain/repositoryInterfaces/chatroom/chatroom-repository.interface";

@injectable()
export class SendMessageUsecase implements ISendMessageUseCase {
  constructor(
    @inject("IMessageRepository")
    private _messageRepository: IMessageRepository,

    @inject("IChatRoomRepository")
    private _chatroomRepository: IChatRoomRepository
  ) {}

  async execute(data: {
    chatRoomId?: string;
    senderId: string;
    senderType: CHAT_USERS
    receiverId: string;
    receiverType: CHAT_USERS
    message: string;
    contextType: CHAT_CONTEXT_TYPE
    contextId: string;
  }): Promise<IMessageEntity> {
    if (!data.senderId || !data.receiverId || !data.message) {
      throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.GROUP.MISSING_MESSAGE_DATA);
    }

    let chatRoom;

    if (data.chatRoomId) {
      chatRoom = await this._chatroomRepository.findById(data.chatRoomId);
      if (!chatRoom) {
        throw new CustomError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGE.CHATROOM_NOT_FOUND);
      }
    } else {
      const participants = [
        { userId: data.senderId, userType: data.senderType },
        { userId: data.receiverId, userType: data.receiverType },
      ];

      chatRoom = await this._chatroomRepository.findByParticipants(
        participants,
        data.contextType,
        data.contextId
      );

      if (!chatRoom) {
        chatRoom = await this._chatroomRepository.save({
          participants,
          contextType: data.contextType,
          contextId : data.contextId
        });
      }
    }
    const newMessage = await this._messageRepository.save({
      chatRoomId: chatRoom._id.toString(),
      senderId: data.senderId,
      senderType: data.senderType,
      receiverId: data.receiverId,
      recieverType: data.receiverType,
      message: data.message,
      status: "sent",
      contextType: data.contextType,
      contextId: data.contextId,
    });

    await this._chatroomRepository.updateById(chatRoom._id.toString(), {
      lastMessage: data.message,
      lastMessageAt: new Date(),
    });

    return newMessage;
  }
}
