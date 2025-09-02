import { inject, injectable } from "tsyringe";
import { IMarkReadNotificationUsecase } from "../../entities/useCaseInterfaces/notification/mark-read-notification-usecase.interface";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { INotificationRepository } from "../../entities/repositoryInterfaces/notification/notification-repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";

@injectable()
export class MarkReadNotification implements IMarkReadNotificationUsecase{
    constructor(
        @inject('INotificationRepository')
        private _notificationRepository : INotificationRepository
    ){}

    async execute(notificationId: string): Promise<void> {
        if(!notificationId){
            throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
        }

        const notification = await this._notificationRepository.findById(notificationId);

        if(!notification){
            throw new NotFoundError(ERROR_MESSAGE.NOTIFICATION_NOT_FOUND);
        }

        await this._notificationRepository.markAsRead(notificationId);
    }
}