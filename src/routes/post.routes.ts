import { Router } from "express";
import { container } from "../config/container";
import { authenticate } from "../middlewares/auth.middleware";
import { uploadSingleImage } from "../middlewares/upload.middleware";
import {
  validateCreatePost,
  validateUpdatePost,
  validateObjectId,
  validatePagination,
  handleValidationErrors,
} from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export class PostRoutes {
  public _route: Router;
  private _postController;

  constructor() {
    this._route = Router();
    this._postController = container.postController;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this._route.get(
      "/",
      validatePagination,
      handleValidationErrors,
      asyncHandler(this._postController.getAllPosts.bind(this._postController))
    );

    this._route.get(
      "/my-posts",
      authenticate,
      validatePagination,
      handleValidationErrors,
      asyncHandler(this._postController.getMyPosts.bind(this._postController))
    );

    this._route.get(
      "/:id",
      validateObjectId,
      handleValidationErrors,
      asyncHandler(this._postController.getPostById.bind(this._postController))
    );

    // Protected routes
    this._route.post(
      "/",
      authenticate,
      uploadSingleImage,
      validateCreatePost,
      handleValidationErrors,
      asyncHandler(this._postController.createPost.bind(this._postController))
    );

    this._route.put(
      "/:id",
      authenticate,
      uploadSingleImage,
      validateObjectId,
      validateUpdatePost,
      handleValidationErrors,
      asyncHandler(this._postController.updatePost.bind(this._postController))
    );

    this._route.delete(
      "/:id",
      authenticate,
      validateObjectId,
      handleValidationErrors,
      asyncHandler(this._postController.deletePost.bind(this._postController))
    );
  }

  public get routes(): Router {
    return this._route;
  }
}
