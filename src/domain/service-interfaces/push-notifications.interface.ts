export interface IPushNotificationService{
    sendNotification(userId : string,title : string,message : string) : Promise<void>;
}