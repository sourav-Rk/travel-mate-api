import { GroupChatDetailsDto } from "../../../dto/response/groupChatDto";

export interface IGetGroupDetailsUsecase{
    execute(groupChatId : string) : Promise<GroupChatDetailsDto>;
}