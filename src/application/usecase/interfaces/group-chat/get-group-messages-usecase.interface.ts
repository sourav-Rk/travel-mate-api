import { IGroupMessageEntity } from "../../../../domain/entities/group-message.entity";

export interface IGetGroupMessagesUsecase {
  execute(groupChatId: string, limit: number, before?: string): Promise<IGroupMessageEntity[]>;
}
