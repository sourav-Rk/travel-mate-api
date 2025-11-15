import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { INotificationRepository } from "../../../../domain/repositoryInterfaces/notification/notification-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IMarkReadNotificationUsecase } from "../../interfaces/notification/mark-read-notification-usecase.interface";

@injectable()
export class MarkReadNotification implements IMarkReadNotificationUsecase {
  constructor(
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository
  ) {}

  async execute(notificationId: string): Promise<void> {
    if (!notificationId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const notification = await this._notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      throw new NotFoundError(ERROR_MESSAGE.NOTIFICATION_NOT_FOUND);
    }

    await this._notificationRepository.markAsRead(notificationId);
  }
}
