export interface IMarkAsDeliveredUsecase{
    execute(chatRoomId : string,userId : string) : Promise<{messageIds : string[]}>
}