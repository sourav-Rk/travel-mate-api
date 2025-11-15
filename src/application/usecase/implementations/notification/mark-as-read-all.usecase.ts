import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { INotificationRepository } from "../../../../domain/repositoryInterfaces/notification/notification-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IMarkAsAllReadUsecase } from "../../interfaces/notification/mark-as-read-all-usecase.interface";

@injectable()
export class MarkAsReadAllUsecase implements IMarkAsAllReadUsecase {
  constructor(
    @inject("INotificationRepository")
    private _notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    await this._notificationRepository.markAsReadAll(userId);
  }
}
