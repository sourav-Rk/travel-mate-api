import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/post.service";
import {
  sendSuccess,
  sendCreated,
  sendPaginated,
} from "../utils/response.utils";
import { AppError } from "../utils/AppError";
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
} from "../shared/constants";

export class PostController {
  private readonly _postService: PostService;

  constructor(postService: PostService) {
    this._postService = postService;
  }

  async createPost(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.UNAUTHORIZED,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (!req.file) {
      throw new AppError(
        ERROR_MESSAGES.POSTS.IMAGE_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const { title, content } = req.body;

    await this._postService.createPost(title, content, req.file, userId);
    sendCreated(res, SUCCESS_MESSAGES.POSTS.CREATED_SUCCESSFULLY);
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this._postService.getAllPosts(page, limit);
    sendPaginated(res, result.posts, result.pagination);
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const post = await this._postService.getPostById(id);
    sendSuccess(res, SUCCESS_MESSAGES.DETAILS_FETCHED, post);
  }

  async getMyPosts(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this._postService.getPostsByAuthor(
      userId,
      page,
      limit
    );
    sendPaginated(res, result.posts, result.pagination);
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const { id } = req.params;
    const { title, content } = req.body;

    const post = await this._postService.updatePost(
      id,
      userId,
      { title, content },
      req.file
    );
    sendSuccess(res, SUCCESS_MESSAGES.POSTS.POST_UPDATED);
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(
        ERROR_MESSAGES.AUTHENTICATION.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const { id } = req.params;
    await this._postService.deletePost(id, userId);
    sendSuccess(res, SUCCESS_MESSAGES.POSTS.POST_DELETED);
  }
}
