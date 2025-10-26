import { IGroupChatEntity } from "../../../../domain/entities/group-chat.entity";

export interface IGetGroupChatByPackageUsecase {
  execute(packageId: string): Promise<IGroupChatEntity | null>;
}

