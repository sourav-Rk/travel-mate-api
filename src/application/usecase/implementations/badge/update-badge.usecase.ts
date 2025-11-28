import { inject, injectable } from "tsyringe";

import { IBadgeEntity } from "../../../../domain/entities/badge.entity";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IBadgeRepository } from "../../../../domain/repositoryInterfaces/badge/badge-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { UpdateBadgeReqDTO } from "../../../dto/request/badge.dto";
import { IUpdateBadgeUsecase } from "../../interfaces/badge/update-badge.interface";

@injectable()
export class UpdateBadgeUsecase implements IUpdateBadgeUsecase {
  constructor(
    @inject("IBadgeRepository")
    private readonly _badgeRepository: IBadgeRepository
  ) {}

  async execute(badgeId: string, data: UpdateBadgeReqDTO, adminId: string): Promise<void> {
   
    if(!badgeId){
      throw new ValidationError(ERROR_MESSAGE.LOCAL_GUIDE.BADGE_ID_IS_REQUIRED)
    }
 
    /**
     *Check if badge exists 
     */
    const existingBadge = await this._badgeRepository.findByBadgeId(badgeId);
    if (!existingBadge) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE.BADGE_NOT_FOUND(badgeId));
    }

    /**
     * Prepare update data 
     */
    const updateData: Partial<IBadgeEntity> = {
      updatedBy: adminId,
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.criteria !== undefined) {
      updateData.criteria = data.criteria.map((criterion) => ({
        type: criterion.type,
        value: criterion.value,
        additionalCondition: criterion.additionalCondition
          ? {
              type: criterion.additionalCondition.type,
              value: criterion.additionalCondition.value,
            }
          : undefined,
      }));
    }
    /**
     *Update badge 
     */
    const updatedBadge = await this._badgeRepository.update(badgeId, updateData);
    if (!updatedBadge) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE.FAILED_TO_UPDATE_BADGE(badgeId));
    }
  }
}








