import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IPostLikeRepository } from "../../../../domain/repositoryInterfaces/post-like/post-like-repository.interface";
import { IVolunteerPostRepository } from "../../../../domain/repositoryInterfaces/volunteer-post/volunteer-post-repository.interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
} from "../../../../shared/constants";
import { IUnlikeVolunteerPostUsecase } from "../../interfaces/volunteer-post/unlike-volunteer-post-usecase.interface";

@injectable()
export class UnlikeVolunteerPostUsecase implements IUnlikeVolunteerPostUsecase {
  constructor(
    @inject("IClientRepository")
    private _clientRepository: IClientRepository,
    @inject("IVolunteerPostRepository")
    private _volunteerPostRepository: IVolunteerPostRepository,
    @inject("IPostLikeRepository")
    private _postLikeRepository: IPostLikeRepository
  ) {}

  async execute(userId: string, postId: string): Promise<void> {
    if (!userId || !postId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const user = await this._clientRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const post = await this._volunteerPostRepository.findById(postId);
    if (!post) {
      throw new NotFoundError(ERROR_MESSAGE.VOLUNTEER_POST.POST_NOT_FOUND);
    }

    /**
     *Check if user has liked this post 
     */
    const existingLike = await this._postLikeRepository.findByUserIdAndPostId(
      userId,
      postId
    );

    if (!existingLike) {
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.VOLUNTEER_POST.NOT_LIKED
      );
    }

    /**
     *Delete like record 
     */
    await this._postLikeRepository.deleteByUserIdAndPostId(userId, postId);

    /**
     *Decrement likes count on post 
     */
    await this._volunteerPostRepository.decrementLikes(postId);
  }
}








