import { inject, injectable } from "tsyringe";

import { UpdateGuideProfileDTO } from "../../../../application/dto/request/guide.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { CustomError } from "../../../../domain/errors/customError";
import { HTTP_STATUS } from "../../../../shared/constants";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IPhoneExistenceService } from "../../../services/interfaces/phone-existence-service.interface";
import { IUpdateGuideProfileUsecase } from "../../interfaces/guide/update-guide-profile-usecase.interface";

@injectable()
export class UpdateGuideProfileUsecase implements IUpdateGuideProfileUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IPhoneExistenceService")
    private _phoneExistenceService: IPhoneExistenceService
  ) {}

  async execute(guideId: string, data: UpdateGuideProfileDTO): Promise<void> {
    if (!guideId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const guide = await this._guideRepository.findById(guideId);
    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    const updateData: Partial<UpdateGuideProfileDTO> = {};

    if (data.profileImage !== undefined) {
      updateData.profileImage = data.profileImage;
    }

    if (data.bio !== undefined) {
      updateData.bio = data.bio;
    }

    if (data.languageSpoken !== undefined) {
      updateData.languageSpoken = data.languageSpoken;
    }

    if (data.phone !== undefined && data.phone !== guide.phone) {
      const isPhoneExists = await this._phoneExistenceService.phoneExists(
        data.phone
      );
      if (isPhoneExists) {
        throw new CustomError(
          HTTP_STATUS.CONFLICT,
          ERROR_MESSAGE.PHONE_NUMBER_EXISTS
        );
      }
      updateData.phone = data.phone;
    }

    if (data.alternatePhone !== undefined && data.alternatePhone !== guide.alternatePhone) {
      if (data.alternatePhone) {
        const isAlternatePhoneExists = await this._phoneExistenceService.phoneExists(
          data.alternatePhone
        );
        if (isAlternatePhoneExists) {
          throw new CustomError(
            HTTP_STATUS.CONFLICT,
            ERROR_MESSAGE.ALTERNATE_PHONE_NUMBER_EXISTS
          );
        }
      }
      updateData.alternatePhone = data.alternatePhone;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ValidationError("No valid fields to update");
    }

    await this._guideRepository.updateById(guideId, updateData);
  }
}


