import { Router } from "express";
import { container } from "../config/container";
import { authenticate } from "../middlewares/auth.middleware";
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  handleValidationErrors,
} from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthRoute {
  private _authController;
  public _route: Router;

  constructor() {
    this._authController = container.authController;
    this._route = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this._route.post(
      "/register",
      validateRegister,
      handleValidationErrors,
      asyncHandler(this._authController.register.bind(this._authController))
    );

    this._route.post(
      "/login",
      validateLogin,
      handleValidationErrors,
      asyncHandler(this._authController.login.bind(this._authController))
    );

    this._route.post(
      "/refresh",
      validateRefreshToken,
      handleValidationErrors,
      asyncHandler(this._authController.refreshToken.bind(this._authController))
    );

    this._route.get(
      "/me",
      authenticate,
      asyncHandler(
        this._authController.getCurrentUser.bind(this._authController)
      )
    );
  }

  public get routes(): Router {
    return this._route;
  }
}
