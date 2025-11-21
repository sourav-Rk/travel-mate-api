import { inject, injectable } from "tsyringe";

import { LocalGuidePublicProfileDto } from "../../../../application/dto/response/local-guide.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { LocalGuideProfileMapper } from "../../../mapper/local-guide-profile.mapper";
import { IGetLocalGuidePublicProfileUsecase } from "../../interfaces/local-guide/get-local-guide-public-profile-usecase.interface";

@injectable()
export class GetLocalGuidePublicProfileUsecase
  implements IGetLocalGuidePublicProfileUsecase
{
  constructor(
    @inject("ILocalGuideProfileRepository")
    private readonly _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(profileId: string): Promise<LocalGuidePublicProfileDto> {
    if (!profileId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }
    const result =
      await this._localGuideProfileRepository.findPublicProfileById(profileId);

    if (!result) {
      throw new NotFoundError(
        ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND
      );
    }

    return LocalGuideProfileMapper.mapToPublicProfileDto(
      result.entity,
      result.userDetails
    );
  }
}
