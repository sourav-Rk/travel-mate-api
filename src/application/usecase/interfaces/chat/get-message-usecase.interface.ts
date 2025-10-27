import { IMessageEntity } from "../../../../domain/entities/message.entity";

export interface IGetMessagesUsecase {
  execute(chatroomId: string,limit:number,userId:string,before?: string,): Promise<IMessageEntity[]>;
}
