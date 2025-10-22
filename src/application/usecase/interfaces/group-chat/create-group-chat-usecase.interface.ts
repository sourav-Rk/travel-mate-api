import { IGroupChatEntity } from "../../../../domain/entities/group-chat.entity";
import { CreateGroupChatDTO } from "../../../dto/response/groupChatDto";

export interface ICreateGroupChatUsecase {
  execute(data: CreateGroupChatDTO): Promise<IGroupChatEntity>;
}
