import { inject, injectable } from "tsyringe";

import { GuideSendMessageDto } from "../../../dto/request/guide-chat.dto";
import { GuideMessageDto } from "../../../dto/response/guide-chat.dto";
import { IGuideMessageRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-message-repository.interface";
import { ISendGuideMessageUsecase } from "../../interfaces/guide-chat/send-guide-message.interface";
import { IGuideChatRoomRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import { CustomError } from "../../../../domain/errors/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { LocalGuideMessageMapper } from "../../../mapper/local-guide-chat.mapper";

@injectable()
export class SendGuideMessageUsecase implements ISendGuideMessageUsecase {
  constructor(
    @inject("IGuideMessageRepository")
    private readonly _guideMessageRepository: IGuideMessageRepository,
    @inject("IGuideChatRoomRepository")
    private readonly _guideChatRoomRepository: IGuideChatRoomRepository
  ) {}

  async execute(data: GuideSendMessageDto): Promise<GuideMessageDto> {
    const room = await this._guideChatRoomRepository.findById(
      data.guideChatRoomId
    );
    if (!room) {
      throw new CustomError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_MESSAGE.CHATROOM_NOT_FOUND
      );
    }

    if (
      data.messageType === "text" &&
      (!data.message || data.message.trim().length === 0)
    ) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.CHAT.MESSAGE_TEXT_REQUIRED
      );
    }

    if (data.messageType === "media" && !data.mediaAttachments?.length) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.CHAT.MEDIA_ATTACHMENT_REQUIRED
      );
    }

    if (data.messageType === "quote" && !data.metadata) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.QUOTE.QUOTE_PAYLOAD_REQUIRED
      );
    }

    const created = await this._guideMessageRepository.create({
      guideChatRoomId: data.guideChatRoomId,
      senderId: data.senderId,
      senderRole: data.senderRole,
      messageType: data.messageType,
      message: data.message,
      mediaAttachments: data.mediaAttachments,
      metadata: data.metadata,
    });

    let lastMessageText = data.message ?? "[attachment]";
    if (data.messageType === "quote") {
      lastMessageText = "Quote sent";
    }

    await this._guideChatRoomRepository.updateById(data.guideChatRoomId, {
      lastMessage: lastMessageText,
      lastMessageAt: new Date(),
    });

    return LocalGuideMessageMapper.mapToGuideMessageDto(created);
  }
}
