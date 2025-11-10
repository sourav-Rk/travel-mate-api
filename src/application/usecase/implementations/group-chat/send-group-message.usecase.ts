import { inject, injectable } from "tsyringe";

import { IGroupMessageEntity } from "../../../../domain/entities/group-message.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { IGroupMessageRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-message-repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { SendGroupMessageDTO } from "../../../dto/response/groupMessageDto";
import { ISendGroupMessageUsecase } from "../../interfaces/group-chat/send-group-message-usecase.interface";

@injectable()
export class SendGroupMessageUsecase implements ISendGroupMessageUsecase {
  constructor(
    @inject("IGroupMessageRepository")
    private _groupMessageRepository: IGroupMessageRepository,

    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async execute(data: SendGroupMessageDTO): Promise<IGroupMessageEntity> {
    const hasText = data.message && data.message.trim().length > 0;
    const hasMedia = data.mediaAttachments && data.mediaAttachments.length > 0;

    if (!hasText && !hasMedia) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "Message must contain text or media"
      );
    }

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
        member.userId.toString() === data.senderId &&
        member.userType === data.senderType
    );

    if (!isMember) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.GROUP.NOT_A_MEMBER
      );
    }

    let messageType: "text" | "media" | "mixed" = "text";
    if (hasText && hasMedia) {
      messageType = "mixed";
    } else if (hasMedia) {
      messageType = "media";

      if (!data.message || data.message.trim().length === 0) {
        data.message =
          data.mediaAttachments!.length === 1
            ? `Sent ${data.mediaAttachments![0].type}`
            : `Sent ${data.mediaAttachments!.length} files`;
      }
    }

    const groupMessage = await this._groupMessageRepository.save({
      groupChatId: data.groupChatId,
      senderId: data.senderId,
      senderType: data.senderType,
      message: data.message?.trim() || "",
      mediaAttachments: data.mediaAttachments,
      messageType,
      status: "sent",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    let senderName = "Unknown User";
    try {
      if (data.senderType === "client") {
        const client = await this._clientRepository.findById(data.senderId);
        if (client) {
          senderName =
            `${client.firstName || ""} ${client.lastName || ""}`.trim() ||
            "Client";
        }
      } else if (data.senderType === "vendor") {
        const vendor = await this._vendorRepository.findById(data.senderId);
        if (vendor) {
          senderName = vendor.agencyName || "Vendor";
        }
      } else if (data.senderType === "guide") {
        const guide = await this._guideRepository.findById(data.senderId);
        if (guide) {
          senderName =
            `${guide.firstName || ""} ${guide.lastName || ""}`.trim() ||
            "Guide";
        }
      }
    } catch (error) {
      console.error("Error fetching sender information:", error);
    }

    let lastMessagePreview = data.message?.trim() || "";
    if (hasMedia && !hasText) {
      const mediaCount = data.mediaAttachments!.length;
      lastMessagePreview =
        mediaCount === 1
          ? `📎 ${
              data.mediaAttachments![0].type === "image"
                ? "Photo"
                : data.mediaAttachments![0].type === "video"
                ? "Video"
                : data.mediaAttachments![0].type === "voice"
                ? "Voice message"
                : "File"
            }`
          : `📎 ${mediaCount} files`;
    } else if (hasMedia && hasText) {
      lastMessagePreview = data.message.trim();
    }

    await this._groupChatRepository.updateById(data.groupChatId, {
      lastMessage: lastMessagePreview,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      ...groupMessage,
      senderName,
    } as IGroupMessageEntity & { senderName: string };
  }
}
