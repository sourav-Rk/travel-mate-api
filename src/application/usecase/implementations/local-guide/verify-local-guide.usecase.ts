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
import { IVerifyLocalGuideUsecase } from "../../interfaces/local-guide/verify-local-guide-usecase.interface";

@injectable()
export class VerifyLocalGuideUsecase implements IVerifyLocalGuideUsecase {
  constructor(
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(profileId: string): Promise<LocalGuideProfileDto> {
    const profile = await this._localGuideProfileRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND);
    }

    if (profile.verificationStatus === VERIFICATION_STATUS.VERIFIED) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_ALREADY_VERIFIED
      );
    }

    const updatedProfile =
      await this._localGuideProfileRepository.updateVerificationStatus(
        profileId,
        VERIFICATION_STATUS.VERIFIED
      );

    if (!updatedProfile) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND);
    }

    return LocalGuideProfileMapper.toDto(updatedProfile);
  }
}
