export interface IGroupChatService{
    handle(bookingId : string,packageId : string):Promise<void>;
}