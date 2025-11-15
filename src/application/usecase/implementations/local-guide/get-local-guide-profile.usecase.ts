import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { LocalGuideProfileDto } from "../../../dto/response/local-guide.dto";
import { LocalGuideProfileMapper } from "../../../mapper/local-guide-profile.mapper";
import { IGetLocalGuideProfileUsecase } from "../../interfaces/local-guide/get-local-guide-profile-usecase.interface";

@injectable()
export class GetLocalGuideProfileUsecase implements IGetLocalGuideProfileUsecase {
  constructor(
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository,
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(userId: string): Promise<LocalGuideProfileDto | null> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    /**
     * Verify user exists
     */
    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    /**
     * Get local guide profile
     */
    const profile = await this._localGuideProfileRepository.findByUserId(userId);

    if (!profile) {
      return null;
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

    return LocalGuideProfileMapper.toDto(profile, userDetails);
  }
}

