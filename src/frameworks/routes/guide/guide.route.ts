import {
  authorizeRole,
  decodeToken,
  verifyAuth,
  verifyResetToken,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { authController, guideController } from "../../di/resolve";
import { BaseRoute } from "../base.route";

export class GuideRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/guide/reset-password",
      verifyResetToken,
      asyncHandler(guideController.resetPassword.bind(guideController))
    );

    this.router.post(
      "/guide/logout",
      verifyAuth,
      authorizeRole(["guide"]),
      asyncHandler(authController.logout.bind(authController))
    );

    this.router.post(
      "/guide/refresh-token",
      decodeToken,
      asyncHandler(authController.refreshToken.bind(authController))
    );
  }
}
