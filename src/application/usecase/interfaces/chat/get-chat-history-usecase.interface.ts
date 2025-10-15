import { ChatListItemDTO } from "../../../dto/response/chatroomDto";

export interface IGetChatHistoryUsecase{
    execute(userId : string,page:number,limit : number,searchTerm:string) : Promise<ChatListItemDTO[]>;
}