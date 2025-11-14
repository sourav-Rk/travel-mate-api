import { inject, injectable } from "tsyringe";

import { UpdateVolunteerPostReqDTO } from "../../../../application/dto/request/volunteer-post.dto";
import { VolunteerPostDto } from "../../../../application/dto/response/volunteer-post.dto";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ILocalGuideProfileRepository } from "../../../../domain/repositoryInterfaces/local-guide-profile/local-guide-profile-repository.interface";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  POST_STATUS,
} from "../../../../shared/constants";
import { IUpdateVolunteerPostUsecase } from "../../interfaces/volunteer-post/update-volunteer-post-usecase.interface";

@injectable()
export class UpdateVolunteerPostUsecase implements IUpdateVolunteerPostUsecase {
  constructor(
    @inject("ILocalGuideProfileRepository")
    private _localGuideProfileRepository: ILocalGuideProfileRepository,
    @inject("IVolunteerPostRepository")
    private _volunteerPostRepository: IVolunteerPostRepository
  ) {}

  async execute(
    userId: string,
    postId: string,
    data: UpdateVolunteerPostReqDTO
  ): Promise<void> {
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

    /**
     * Validate tags count
     */
    if (data.tags && data.tags.length > 20) {
      throw new ValidationError(ERROR_MESSAGE.VOLUNTEER_POST.MAX_TAGS_EXCEEDED);
    }

    // Only allow updating description, content, and tags
    const updateData: Partial<typeof existingPost> = {};

    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.content !== undefined) {
      updateData.content = data.content;
    }
    if (data.tags !== undefined) {
      updateData.tags = data.tags;
    }

    const updatedPost = await this._volunteerPostRepository.updateById(
      postId,
      updateData
    );

    if (!updatedPost) {
      throw new NotFoundError(ERROR_MESSAGE.VOLUNTEER_POST.POST_NOT_FOUND);
    }
 }
}
