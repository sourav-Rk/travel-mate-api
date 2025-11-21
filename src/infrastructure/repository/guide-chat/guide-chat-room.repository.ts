import { injectable } from "tsyringe";

import { LocalGuideMessageMapper } from "../../../application/mapper/local-guide-chat.mapper";
import { IGuideChatRoomEntity } from "../../../domain/entities/guide-chat-room.entity";
import { IGuideChatRoomRepository } from "../../../domain/repositoryInterfaces/guide-chat/guide-chat-room-repository.interface";
import {
  guideChatRoomDB,
  IGuideChatRoomModel,
} from "../../database/models/guide-chat-room.model";
import { BaseRepository } from "../baseRepository";

@injectable()
export class GuideChatRoomRepository
  extends BaseRepository<IGuideChatRoomModel, IGuideChatRoomEntity>
  implements IGuideChatRoomRepository
{
  constructor() {
    super(guideChatRoomDB, LocalGuideMessageMapper.toLocalGuideChatRoomEntity);
  }
  async findByRoomKey(roomKey: string): Promise<IGuideChatRoomEntity | null> {
    const room = await guideChatRoomDB.findOne({ roomKey }).lean();
    return room
      ? LocalGuideMessageMapper.toLocalGuideChatRoomEntity(room)
      : null;
  }

  async create(
    room: Omit<IGuideChatRoomEntity, "_id">
  ): Promise<IGuideChatRoomEntity> {
    const created = await guideChatRoomDB.create(room);
    return LocalGuideMessageMapper.toLocalGuideChatRoomEntity(created);
  }

  async listByUser(userId: string): Promise<IGuideChatRoomEntity[]> {
    const rooms = await guideChatRoomDB
      .find({ "participants.userId": userId })
      .sort({ lastMessageAt: -1 })
      .lean();
    return rooms.map(LocalGuideMessageMapper.toLocalGuideChatRoomEntity);
  }
}
