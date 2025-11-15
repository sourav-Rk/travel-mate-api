import { inject, injectable } from "tsyringe";

import { LocalGuideProfileDto } from "../../../../application/dto/response/local-guide.dto";
import { LocalGuideProfileMapper } from "../../../../application/mapper/local-guide-profile.mapper";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  VERIFICATION_STATUS,
} from "../../../../shared/constants";
import { IRejectLocalGuideUsecase } from "../../interfaces/local-guide/reject-local-guide-usecase.interface";

@injectable()
export class RejectLocalGuideUsecase implements IRejectLocalGuideUsecase {
  constructor(
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(
    profileId: string,
    rejectionReason: string
  ): Promise<LocalGuideProfileDto> {
    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.REQUIRED_FIELDS_MISSING
      );
    }

    const profile = await this._localGuideProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND);
    }

    if (profile.verificationStatus === VERIFICATION_STATUS.REJECTED) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.LOCAL_GUIDE.ALREADY_REJECTED
      );
    }

    const updatedProfile = await this._localGuideProfileRepository.updateVerificationStatus(
      profileId,
      VERIFICATION_STATUS.REJECTED,
      rejectionReason
    );

    if (!updatedProfile) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND);
    }

    return LocalGuideProfileMapper.toDto(updatedProfile);
  }
}

