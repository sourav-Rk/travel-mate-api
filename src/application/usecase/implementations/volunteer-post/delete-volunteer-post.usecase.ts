import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IDeleteVolunteerPostUsecase } from "../../interfaces/volunteer-post/delete-volunteer-post-usecase.interface";

@injectable()
export class DeleteVolunteerPostUsecase implements IDeleteVolunteerPostUsecase {
  constructor(
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository,
    @inject("IVolunteerPostRepository")
    private _volunteerPostRepository: IVolunteerPostRepository
  ) {}

  async execute(userId: string, postId: string): Promise<void> {
    if (!userId || !postId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const profile = await this._localGuideProfileRepository.findByUserId(
      userId
    );
    if (!profile) {
      throw new NotFoundError(
        ERROR_MESSAGE.VOLUNTEER_POST.LOCAL_GUIDE_PROFILE_NOT_FOUND
      );
    }

    const existingPost = await this._volunteerPostRepository.findById(postId);
    if (!existingPost) {
      throw new NotFoundError(ERROR_MESSAGE.VOLUNTEER_POST.POST_NOT_FOUND);
    }

    if (existingPost.localGuideProfileId !== profile._id) {
      throw new CustomError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGE.VOLUNTEER_POST.UNAUTHORIZED_ACCESS
      );
    }

    await this._volunteerPostRepository.deleteById(postId);

    /**
     *  Decrement totalPosts in profile stats (only if it's greater than 0)
     */
    if (profile.stats.totalPosts > 0) {
      await this._localGuideProfileRepository.updateByUserId(userId, {
        stats: {
          ...profile.stats,
          totalPosts: profile.stats.totalPosts - 1,
        },
      });
    }
  }
}
