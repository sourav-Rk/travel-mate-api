import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IBadgeRepository } from "../../../../domain/repositoryInterfaces/badge/badge-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IDeleteBadgeUsecase } from "../../interfaces/badge/delete-badge.interface";

@injectable()
export class DeleteBadgeUsecase implements IDeleteBadgeUsecase {
  constructor(
    @inject("IBadgeRepository")
    private readonly _badgeRepository: IBadgeRepository
  ) {}

  async execute(badgeId: string): Promise<boolean> {
    if (!badgeId) {
      throw new ValidationError(ERROR_MESSAGE.LOCAL_GUIDE.BADGE_ID_IS_REQUIRED);
    }

    /**
     *Check if badge exists
     */
    const existingBadge = await this._badgeRepository.findByBadgeId(badgeId);
    if (!existingBadge) {
      throw new NotFoundError(
        ERROR_MESSAGE.LOCAL_GUIDE.BADGE_NOT_FOUND(badgeId)
      );
    }

    /**
     *Soft delete (set isActive to false)
     */
    const deleted = await this._badgeRepository.delete(badgeId);
    return deleted;
  }
}



