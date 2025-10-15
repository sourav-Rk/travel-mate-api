import { IMessageEntity } from "../../../../domain/entities/message.entity";
import { PaginatedMessagesDto } from "../../../dto/response/messageDto";

export interface IGetMessagesUsecase {
  execute(chatroomId: string,limit:number,userId:string,before?: string,): Promise<IMessageEntity[]>;
}
