import { inject, injectable } from "tsyringe";
import {  IGetNotificationsUsecase } from "../../entities/useCaseInterfaces/notification/get-notifications-usecase.interface";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { INotificationEntity } from "../../entities/modelsEntity/notification.entity";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../shared/constants";

@injectable()
export class GetNotificationsUsecase implements IGetNotificationsUsecase {
    constructor(
      @inject('INotificationRepository')
      private _notificationRepository : INotificationRepository
    ){}

    async execute(userId: string): Promise<INotificationEntity[]> {
        if(!userId){
            throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
        }

        const notifications = await this._notificationRepository.getUserNotifications(userId);

        return notifications;
    }
}