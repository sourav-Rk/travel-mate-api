import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { ICreateVolunteerPostUsecase } from "../../../application/usecase/interfaces/volunteer-post/create-volunteer-post-usecase.interface";
import { IUpdateVolunteerPostUsecase } from "../../../application/usecase/interfaces/volunteer-post/update-volunteer-post-usecase.interface";
import { IDeleteVolunteerPostUsecase } from "../../../application/usecase/interfaces/volunteer-post/delete-volunteer-post-usecase.interface";
import { IGetVolunteerPostUsecase } from "../../../application/usecase/interfaces/volunteer-post/get-volunteer-post-usecase.interface";
import { IGetVolunteerPostsUsecase } from "../../../application/usecase/interfaces/volunteer-post/get-volunteer-posts-usecase.interface";
import { IGetVolunteerPostsByLocationUsecase } from "../../../application/usecase/interfaces/volunteer-post/get-volunteer-posts-by-location-usecase.interface";
import { ISearchVolunteerPostsUsecase } from "../../../application/usecase/interfaces/volunteer-post/search-volunteer-posts-usecase.interface";
import { ILikeVolunteerPostUsecase } from "../../../application/usecase/interfaces/volunteer-post/like-volunteer-post-usecase.interface";
import { IUnlikeVolunteerPostUsecase } from "../../../application/usecase/interfaces/volunteer-post/unlike-volunteer-post-usecase.interface";
import { ResponseHelper } from "../../../infrastructure/config/server/helpers/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants";
import { IVolunteerPostController } from "../../interfaces/controllers/volunteer-post/volunteer-post.controller.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {
  GetVolunteerPostsByLocationReqDTO,
  GetVolunteerPostsReqDTO,
  SearchVolunteerPostsReqDTO,
  UpdateVolunteerPostReqDTO,
} from "../../../application/dto/request/volunteer-post.dto";
import { ValidationError } from "../../../domain/errors/validationError";

@injectable()
export class VolunteerPostController implements IVolunteerPostController {
  constructor(
    @inject("ICreateVolunteerPostUsecase")
    private _createVolunteerPostUsecase: ICreateVolunteerPostUsecase,
    @inject("IUpdateVolunteerPostUsecase")
    private _updateVolunteerPostUsecase: IUpdateVolunteerPostUsecase,
    @inject("IDeleteVolunteerPostUsecase")
    private _deleteVolunteerPostUsecase: IDeleteVolunteerPostUsecase,
    @inject("IGetVolunteerPostUsecase")
    private _getVolunteerPostUsecase: IGetVolunteerPostUsecase,
    @inject("IGetVolunteerPostsUsecase")
    private _getVolunteerPostsUsecase: IGetVolunteerPostsUsecase,
    @inject("IGetVolunteerPostsByLocationUsecase")
    private _getVolunteerPostsByLocationUsecase: IGetVolunteerPostsByLocationUsecase,
    @inject("ISearchVolunteerPostsUsecase")
    private _searchVolunteerPostsUsecase: ISearchVolunteerPostsUsecase,
    @inject("ILikeVolunteerPostUsecase")
    private _likeVolunteerPostUsecase: ILikeVolunteerPostUsecase,
    @inject("IUnlikeVolunteerPostUsecase")
    private _unlikeVolunteerPostUsecase: IUnlikeVolunteerPostUsecase
  ) {}

  async createPost(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const postData = req.body;

    await this._createVolunteerPostUsecase.execute(userId, postData);

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.VOLUNTEER_POST.POST_CREATED
    );
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { postId } = req.params;

    const updateData = plainToInstance(UpdateVolunteerPostReqDTO, req.body);

    const errors = await validate(updateData, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const firstError = errors[0];
      const firstMessage = firstError?.constraints
        ? Object.values(firstError.constraints)[0]
        : "Validation failed";
      throw new ValidationError(firstMessage);
    }

    await this._updateVolunteerPostUsecase.execute(userId, postId, updateData);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.VOLUNTEER_POST.POST_UPDATED
    );
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { postId } = req.params;

    await this._deleteVolunteerPostUsecase.execute(userId, postId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.VOLUNTEER_POST.POST_DELETED
    );
  }

  async getPost(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user?.id || "";
    const { postId } = req.params;
    const incrementViews = req.query.incrementViews !== "false";

    const post = await this._getVolunteerPostUsecase.execute(
      postId,
      userId,
      incrementViews
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      post,
      "post"
    );
  }

  async likePost(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { postId } = req.params;

    await this._likeVolunteerPostUsecase.execute(userId, postId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.VOLUNTEER_POST.POST_LIKED
    );
  }

  async unlikePost(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.id;
    const { postId } = req.params;

    await this._unlikeVolunteerPostUsecase.execute(userId, postId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.VOLUNTEER_POST.POST_UNLIKED
    );
  }

  async getPosts(req: Request, res: Response): Promise<void> {
    const filters = plainToInstance(GetVolunteerPostsReqDTO, req.query);
    const result = await this._getVolunteerPostsUsecase.execute(filters);

    ResponseHelper.paginated(
      res,
      result.posts,
      result.totalPages,
      result.currentPage,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      "posts"
    );
  }

  async getPostsByLocation(req: Request, res: Response): Promise<void> {
    const filters = plainToInstance(
      GetVolunteerPostsByLocationReqDTO,
      req.query
    );

    const result = await this._getVolunteerPostsByLocationUsecase.execute(
      filters
    );

    ResponseHelper.paginated(
      res,
      result.posts,
      result.totalPages,
      result.currentPage,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      "posts"
    );
  }

  async searchPosts(req: Request, res: Response): Promise<void> {
    const filters = plainToInstance(SearchVolunteerPostsReqDTO, req.query);

    const result = await this._searchVolunteerPostsUsecase.execute(filters);

    ResponseHelper.paginated(
      res,
      result.posts,
      result.totalPages,
      result.currentPage,
      SUCCESS_MESSAGE.DETAILS_FETCHED,
      "posts"
    );
  }
}
