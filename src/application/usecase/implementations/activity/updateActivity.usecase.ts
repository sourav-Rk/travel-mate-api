import { inject, injectable } from "tsyringe";

import { IActivitiesEntity } from "../../../../domain/entities/activites.entity";
import { IActivitiesRepository } from "../../../../domain/repositoryInterfaces/package/activities-repository.interface";
import { IUpdateActivityUsecase } from "../../interfaces/activity/updateActivity-usecase.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class UpdateActivityUsecase implements IUpdateActivityUsecase {
  constructor(
    @inject("IActivitiesRepository")
    private _activitiesRepository: IActivitiesRepository
  ) {}

  async execute(id: string, data: Partial<IActivitiesEntity>): Promise<void> {
    if (!id) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const activityExist = await this._activitiesRepository.findById(id);

    if (!activityExist) {
      throw new NotFoundError(ERROR_MESSAGE.ACTIVITY_NOT_EXIST);
    }

    await this._activitiesRepository.update(id, data);
  }
}
