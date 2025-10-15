import { IChatRoomEntity } from "../../../../domain/entities/chatroom.entity";

export interface IGetChatroomUsecase{
    execute(id : string) : Promise<IChatRoomEntity | null>;
}