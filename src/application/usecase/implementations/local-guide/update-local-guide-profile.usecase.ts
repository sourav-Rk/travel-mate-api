import { inject, injectable } from "tsyringe";

import { ILocalGuideProfileEntity } from "../../../../domain/entities/local-guide-profile.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { UpdateLocalGuideProfileReqDTO } from "../../../dto/request/local-guide.dto";
import { IUpdateLocalGuideProfileUsecase } from "../../interfaces/local-guide/update-local-guide-profile-usecase.interface";

@injectable()
export class UpdateLocalGuideProfileUsecase
  implements IUpdateLocalGuideProfileUsecase
{
  constructor(
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository,
    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(
    userId: string,
    data: UpdateLocalGuideProfileReqDTO
  ): Promise<void> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const existingProfile =
      await this._localGuideProfileRepository.findByUserId(userId);
    if (!existingProfile) {
      throw new NotFoundError(
        ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND
      );
    }
    /**
     * Validate coordinates if location is provided
     */
    if (data.location?.coordinates) {
      const [longitude, latitude] = data.location.coordinates;
      if (
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
      ) {
        throw new CustomError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGE.LOCAL_GUIDE.INVALID_COORDINATES
        );
      }
    }

    /**
     * Build update data object - only include defined fields
     */
    const updateData: Partial<ILocalGuideProfileEntity> = {};

    /**
     * Update location if provided
     */
    if (data.location) {
      updateData.location = {
        type: "Point",
        coordinates: data.location.coordinates,
        city: data.location.city,
        state: data.location.state,
        country: data.location.country,
        address: data.location.address,
        formattedAddress: data.location.formattedAddress,
      };
    }

    if (data.hourlyRate !== undefined) {
      updateData.hourlyRate = data.hourlyRate;
    }

    if (data.languages !== undefined) {
      updateData.languages = data.languages;
    }

    if (data.specialties !== undefined) {
      updateData.specialties = data.specialties;
    }

    if (data.bio !== undefined) {
      updateData.bio = data.bio;
    }

    if (data.profileImage !== undefined) {
      updateData.profileImage = data.profileImage;
    }

    if (data.isAvailable !== undefined) {
      updateData.isAvailable = data.isAvailable;
    }

    if (data.availabilityNote !== undefined) {
      updateData.availabilityNote = data.availabilityNote;
    }

    const updatedProfile =
      await this._localGuideProfileRepository.updateByUserId(
        userId,
        updateData
      );

    if (!updatedProfile) {
      throw new NotFoundError(
        ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND
      );
    }
  }
}
