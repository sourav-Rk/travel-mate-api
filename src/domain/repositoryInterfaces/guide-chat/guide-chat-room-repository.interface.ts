import { IGuideChatRoomEntity } from "../../../domain/entities/guide-chat-room.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGuideChatRoomRepository extends IBaseRepository<IGuideChatRoomEntity> {
  findByRoomKey(roomKey: string): Promise<IGuideChatRoomEntity | null>;
  create(room: Omit<IGuideChatRoomEntity, "_id">): Promise<IGuideChatRoomEntity>;
  listByUser(userId: string): Promise<IGuideChatRoomEntity[]>;
}

