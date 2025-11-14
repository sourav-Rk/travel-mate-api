import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { LocalGuideProfileDto } from "../../../dto/response/local-guide.dto";
import { LocalGuideProfileMapper } from "../../../mapper/local-guide-profile.mapper";
import { IUpdateLocalGuideAvailabilityUsecase } from "../../interfaces/local-guide/update-local-guide-availability-usecase.interface";

@injectable()
export class UpdateLocalGuideAvailabilityUsecase
  implements IUpdateLocalGuideAvailabilityUsecase
{
  constructor(
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository,
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(
    userId: string,
    isAvailable: boolean,
    availabilityNote?: string
  ): Promise<LocalGuideProfileDto> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    /**
     * Update availability
     */
    const updatedProfile = await this._localGuideProfileRepository.updateAvailability(
      userId,
      isAvailable,
      availabilityNote
    );

    if (!updatedProfile) {
      throw new NotFoundError(ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND);
    }

    /**
     * Get user details
     */
    const userDetails = {
      _id: user._id || "",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
    };

    return LocalGuideProfileMapper.toDto(updatedProfile, userDetails);
  }
}

