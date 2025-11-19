import { inject, injectable } from "tsyringe";

import { RequestLocalGuideVerificationReqDTO } from "../../../../application/dto/request/local-guide.dto";
import { LocalGuideProfileDto } from "../../../../application/dto/response/local-guide.dto";
import { LocalGuideProfileMapper } from "../../../../application/mapper/local-guide-profile.mapper";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  VERIFICATION_STATUS,
} from "../../../../shared/constants";
import { IRequestLocalGuideVerificationUsecase } from "../../interfaces/local-guide/request-local-guide-verification-usecase.interface";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class RequestLocalGuideVerificationUsecase
  implements IRequestLocalGuideVerificationUsecase
{
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository
  ) {}

  async execute(
    userId: string,
    data: RequestLocalGuideVerificationReqDTO
  ): Promise<LocalGuideProfileDto> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    /**
     * Validate coordinates
     */
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

    /**
     * Check if profile already exists
     */
    const existingProfile =
      await this._localGuideProfileRepository.findByUserId(userId);

    let profile;

    if (existingProfile) {
      /**
       * If profile exists and is rejected, allow resubmission
       */
      if (existingProfile.verificationStatus === VERIFICATION_STATUS.REJECTED) {
        /**
         *  Update existing profile for resubmission - clear rejection fields
         */
        profile = await this._localGuideProfileRepository.updateByUserId(
          userId,
          {
            verificationStatus: VERIFICATION_STATUS.PENDING,
            verificationRequestedAt: new Date(),
            verificationDocuments: {
              idProof: data.idProof,
              addressProof: data.addressProof,
              additionalDocuments: data.additionalDocuments || [],
            },
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
              city: data.location.city,
              state: data.location.state,
              country: data.location.country,
              address: data.location.address,
              formattedAddress: data.location.formattedAddress,
            },
            hourlyRate:
              data.hourlyRate !== undefined
                ? data.hourlyRate
                : existingProfile.hourlyRate || 0,
            languages: data.languages,
            specialties: data.specialties || [],
            bio: data.bio,
            profileImage: data.profileImage,
            stats: existingProfile.stats,
            badges: existingProfile.badges,
            isAvailable:
              data.isAvailable !== undefined
                ? data.isAvailable
                : existingProfile.isAvailable ?? true,
            availabilityNote:
              data.availabilityNote !== undefined
                ? data.availabilityNote
                : existingProfile.availabilityNote,
          },
          true // clearRejectionFields = true to clear rejectedAt and rejectionReason
        );

        if (!profile) {
          throw new NotFoundError(
            ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_NOT_FOUND
          );
        }
      } else {
        /**
         *  Profile exists but is not rejected - cannot resubmit
         */
        throw new CustomError(
          HTTP_STATUS.CONFLICT,
          ERROR_MESSAGE.LOCAL_GUIDE.LOCAL_GUIDE_PROFILE_ALREADY_EXISTS
        );
      }
    } else {
      /**
       *  Create new local guide profile
       */
      profile = await this._localGuideProfileRepository.save({
        userId,
        verificationStatus: VERIFICATION_STATUS.PENDING,
        verificationRequestedAt: new Date(),
        verificationDocuments: {
          idProof: data.idProof,
          addressProof: data.addressProof,
          additionalDocuments: data.additionalDocuments || [],
        },
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
          city: data.location.city,
          state: data.location.state,
          country: data.location.country,
          address: data.location.address,
          formattedAddress: data.location.formattedAddress,
        },
        hourlyRate: data.hourlyRate || 0,
        languages: data.languages,
        specialties: data.specialties || [],
        bio: data.bio,
        profileImage: data.profileImage,
        isAvailable: data.isAvailable ?? true,
        availabilityNote: data.availabilityNote,
        stats: {
          totalSessions: 0,
          completedSessions: 0,
          averageRating: 0,
          totalRatings: 0,
          totalPosts: 0,
          totalEarnings: 0,
          completionRate:0,
          maxPostLikes:0,
          maxPostViews:0,
          totalLikes:0,
          totalViews:0
        },
        badges: [],
      });

      /**
       *  Update client to link profile (only for new profiles)
       */
      await this._clientRepository.updateById(userId, {
        isLocalGuide: true,
        localGuideProfileId: profile._id,
      });
    }

    /**
     *Get user details for response
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
