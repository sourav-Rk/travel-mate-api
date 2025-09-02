export interface INotificationUsecase {
    sendNotification(userId : string,title : string,body : string) : Promise<void>
}