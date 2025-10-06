import { inject, injectable } from "tsyringe";
import { IMarkAsAllReadUsecase } from "../../interfaces/notification/mark-as-read-all-usecase.interface";
import { INotificationRepository } from "../../../../domain/repositoryInterfaces/notification/notification-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";

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
