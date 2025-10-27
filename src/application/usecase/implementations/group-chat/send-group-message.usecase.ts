import { inject, injectable } from "tsyringe";

import { IGroupMessageEntity } from "../../../../domain/entities/group-message.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { IGroupMessageRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-message-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { SendGroupMessageDTO } from "../../../dto/response/groupMessageDto";
import { ISendGroupMessageUsecase } from "../../interfaces/group-chat/send-group-message-usecase.interface";

@injectable()
export class SendGroupMessageUsecase implements ISendGroupMessageUsecase {
  constructor(
    @inject("IGroupMessageRepository")
    private _groupMessageRepository: IGroupMessageRepository,

    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository
  ) {}

  async execute(data: SendGroupMessageDTO): Promise<IGroupMessageEntity> {

    const groupChat = await this._groupChatRepository.findById(
      data.groupChatId
    );
    if (!groupChat) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.GROUP.NO_GROUP_CHAT
      );
    }


    const isMember = groupChat.members.some(
      (member) =>
        member.userId.toString() === data.senderId && member.userType === data.senderType
    );

    if (!isMember) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.GROUP.NOT_A_MEMBER
      );
    }

    const groupMessage = await this._groupMessageRepository.save({
      groupChatId: data.groupChatId,
      senderId: data.senderId,
      senderType: data.senderType,
      message: data.message.trim(),
      status: "sent",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this._groupChatRepository.updateById(data.groupChatId, {
      lastMessage: data.message.trim(),
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    });

    return groupMessage;
  }
}

