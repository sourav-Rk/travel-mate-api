export interface IMarkReadNotificationUsecase {
    execute(notificationId : string) : Promise<void>;
}