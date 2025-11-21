import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IGuideChatRoomRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { GuideChatCreateDto } from "../../../dto/request/guide-chat.dto";
import {
  GuideChatRoomDto,
  GuideChatParticipantDto,
} from "../../../dto/response/guide-chat.dto";
import { LocalGuideMessageMapper } from "../../../mapper/local-guide-chat.mapper";
import { ICreateGuideChatRoomUsecase } from "../../interfaces/guide-chat/create-guide-chat-room.interface";

@injectable()
export class CreateGuideChatRoomUsecase implements ICreateGuideChatRoomUsecase {
  constructor(
    @inject("IGuideChatRoomRepository")
    private readonly _guideChatRoomRepository: IGuideChatRoomRepository,
    @inject("IClientRepository")
    private readonly _clientRepository: IClientRepository
  ) {}

  async execute(data: GuideChatCreateDto): Promise<GuideChatRoomDto> {
    if (data.travellerId === data.guideId) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.GUIDE_CHAT.SELF_CHAT_NOT_ALLOWED
      );
    }

    const roomKey = `${data.travellerId}_${data.guideId}`;

    const existingRoom = await this._guideChatRoomRepository.findByRoomKey(
      roomKey
    );
    if (existingRoom) {
      const enrichedParticipants = await this.enrichParticipants(
        existingRoom.participants
      );

      return LocalGuideMessageMapper.maptToGuideChatRoomDto(
        existingRoom,
        enrichedParticipants
      );
    }

    const created = await this._guideChatRoomRepository.create({
      roomKey,
      participants: [
        { userId: data.travellerId, role: "client" },
        { userId: data.guideId, role: "guide" },
      ],
      latestContext: data.context,
    });

    const enrichedParticipants = await this.enrichParticipants(
      created.participants
    );

    return LocalGuideMessageMapper.maptToGuideChatRoomDto(
      created,
      enrichedParticipants
    );
  }

  private async enrichParticipants(
    participants: Array<{ userId: string; role: "client" | "guide" }>
  ): Promise<GuideChatParticipantDto[]> {
    return Promise.all(
      participants.map(async (participant) => {
        const enrichedParticipant: GuideChatParticipantDto = {
          userId: participant.userId,
          role: participant.role,
        };

        try {
          const client = await this._clientRepository.findById(
            participant.userId
          );
          if (client) {
            enrichedParticipant.firstName = client.firstName;
            enrichedParticipant.lastName = client.lastName;
            enrichedParticipant.profileImage = client.profileImage;
          }
        } catch (error) {}

        return enrichedParticipant;
      })
    );
  }
}
