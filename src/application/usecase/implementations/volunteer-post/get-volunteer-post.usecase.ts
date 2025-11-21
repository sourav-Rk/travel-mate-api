import { inject, injectable } from "tsyringe";

import { VolunteerPostDetailDto } from "../../../../application/dto/response/volunteer-post.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { IPostLikeRepository } from "../../../../domain/repositoryInterfaces/post-like/post-like-repository.interface";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { VolunteerPostMapper } from "../../../mapper/volunteer-post.mapper";
import { IUpdateLocalGuideStatsUsecase } from "../../interfaces/badge/update-stats.interface";
import { IGetVolunteerPostUsecase } from "../../interfaces/volunteer-post/get-volunteer-post-usecase.interface";

@injectable()
export class GetVolunteerPostUsecase implements IGetVolunteerPostUsecase {
  constructor(
    @inject("IVolunteerPostRepository")
    private _volunteerPostRepository: IVolunteerPostRepository,
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository,
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IPostLikeRepository")
    private _postLikeRepository: IPostLikeRepository,
    @inject("IUpdateLocalGuideStatsUsecase")
    private _updateLocalGuideStatsUsecase: IUpdateLocalGuideStatsUsecase
  ) {}

  async execute(
    postId: string,
    viewUserId : string,
    incrementViews: boolean = true
  ): Promise<VolunteerPostDetailDto> {
    if (!postId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    let post = await this._volunteerPostRepository.findById(postId);
    if (!post) {
      throw new NotFoundError(ERROR_MESSAGE.VOLUNTEER_POST.POST_NOT_FOUND);
    }

    const profile = await this._localGuideProfileRepository.findById(post.localGuideProfileId);

    const isOwner = profile && profile.userId === viewUserId;

    /**
     * increment view if requested and viewer is not the ownewr
     */

    if (incrementViews && !isOwner) {
      const updatedPost = await this._volunteerPostRepository.incrementViews(
        postId
      );
      if (updatedPost) {
        post = updatedPost;
      }

      /**
       * Update guide stats and trigger badge evaluation
       */
      try {
        await this._updateLocalGuideStatsUsecase.execute(
          post.localGuideProfileId,
          { trigger: "post_view" }
        );
      } catch (error) {
        // Log error but don't fail the view operation
        console.error("Error updating guide stats for badge evaluation:", error);
      }
    }


    /**
     * Get user details if profile exists
     */
    let guideDetails;
    if (profile) {
      const user = await this._clientRepository.findById(profile.userId);
      if (user) {
        guideDetails = {
          _id: profile._id || "",
          userId : user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileImage: profile.profileImage || user.profileImage,
          bio: profile.bio,
          specialties: profile.specialties,
          languages: profile.languages,
          hourlyRate: profile.hourlyRate,
          gender :user.gender,
          isAvailable : profile.isAvailable
        };
      }
    }

    // Check if user has liked this post
    let isLiked = false;
    if (viewUserId) {
      const like = await this._postLikeRepository.findByUserIdAndPostId(
        viewUserId,
        postId
      );
      isLiked = !!like;
    }

    const postDto = VolunteerPostMapper.mapToPostDetailsDto(post, guideDetails!);
    postDto.isLiked = isLiked;
    return postDto;
  }
}
