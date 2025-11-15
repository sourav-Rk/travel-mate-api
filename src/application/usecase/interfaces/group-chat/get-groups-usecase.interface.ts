import { IGroupChatEntity } from "../../../../domain/entities/group-chat.entity";

export interface IGetGroupsUsecase {
    execute(userId : string,searchTerm?:string) : Promise<IGroupChatEntity[]>;
}