import { inject, injectable } from "tsyringe";
import { IGetNotificationsUsecase } from "../../interfaces/notification/get-notifications-usecase.interface";
import { INotificationRepository } from "../../../../domain/repositoryInterfaces/notification/notification-repository.interface";
import { INotificationEntity } from "../../../../domain/entities/notification.entity";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";

@injectable()
export class GetNotificationsUsecase implements IGetNotificationsUsecase {
  constructor(
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string): Promise<INotificationEntity[]> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const notifications =
      await this._notificationRepository.getUserNotifications(userId);

    return notifications;
  }
}
