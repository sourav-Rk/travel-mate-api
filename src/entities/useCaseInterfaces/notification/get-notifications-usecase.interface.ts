import { INotificationEntity } from "../../modelsEntity/notification.entity";

export interface IGetNotificationsUsecase {
    execute(userId : string) : Promise<INotificationEntity[]>;
}