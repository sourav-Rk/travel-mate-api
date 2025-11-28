import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { IBadgeRepository } from "../../../../domain/repositoryInterfaces/badge/badge-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { CreateBadgeReqDTO } from "../../../dto/request/badge.dto";
import { BadgeDto } from "../../../dto/response/badge.dto";
import { ICreateBadgeUsecase } from "../../interfaces/badge/create-badge.interface";

@injectable()
export class CreateBadgeUsecase implements ICreateBadgeUsecase {
  constructor(
    @inject("IBadgeRepository")
    private readonly _badgeRepository: IBadgeRepository
  ) {}

  async execute(data: CreateBadgeReqDTO, adminId: string): Promise<BadgeDto> {
    if(!adminId){
       throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    /**
     *Check if badgeId already exists 
     */
    const exists = await this._badgeRepository.exists(data.badgeId);
    if (exists) {
      throw new ValidationError(ERROR_MESSAGE.LOCAL_GUIDE.BADGE_ID_ALREADY_EXISTS(data.badgeId));
    }


    /**
     *Create badge entity 
     */
    const badgeEntity = await this._badgeRepository.create({
      badgeId: data.badgeId,
      name: data.name,
      description: data.description,
      category: data.category,
      icon: data.icon,
      criteria: data.criteria.map((criterion) => ({
        type: criterion.type,
        value: criterion.value,
        additionalCondition: criterion.additionalCondition
          ? {
              type: criterion.additionalCondition.type,
              value: criterion.additionalCondition.value,
            }
          : undefined,
      })),
      priority: data.priority ?? 0,
      isActive: true,
      createdBy: adminId,
      updatedBy: adminId,
    });

    // Map to DTO
    return {
      id: badgeEntity.badgeId,
      badgeId: badgeEntity.badgeId,
      name: badgeEntity.name,
      description: badgeEntity.description,
      category: badgeEntity.category,
      icon: badgeEntity.icon,
      criteria: badgeEntity.criteria,
      priority: badgeEntity.priority,
      isActive: badgeEntity.isActive,
      createdAt: badgeEntity.createdAt,
      updatedAt: badgeEntity.updatedAt,
    };
  }
}








