import { inject, injectable } from "tsyringe";

import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IGuideChatRoomRepository } from "../../../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import {
  GuideChatRoomDto,
  GuideChatParticipantDto,
} from "../../../dto/response/guide-chat.dto";
import { LocalGuideMessageMapper } from "../../../mapper/local-guide-chat.mapper";
import { IGetGuideChatRoomsUsecase } from "../../interfaces/guide-chat/get-guide-chat-rooms.interface";

@injectable()
export class GetGuideChatRoomsUsecase implements IGetGuideChatRoomsUsecase {
  constructor(
    @inject("IGuideChatRoomRepository")
    private readonly _guideChatRoomRepository: IGuideChatRoomRepository,
    @inject("IClientRepository")
    private readonly _clientRepository: IClientRepository
  ) {}

  async execute(userId: string): Promise<GuideChatRoomDto[]> {
    const rooms = await this._guideChatRoomRepository.listByUser(userId);

    const enrichedRooms = await Promise.all(
      rooms.map(async (room) => {
        const enrichedParticipants = await Promise.all(
          room.participants.map(async (participant) => {
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
            } catch {
            }

            return enrichedParticipant;
          })
        );

        return LocalGuideMessageMapper.maptToGuideChatRoomDto(room,enrichedParticipants);

      })
    );

    return enrichedRooms;
  }
}
