import {
  authorizeRole,
  decodeToken,
  verifyAuth,
  verifyResetToken,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  authController,
  guideController,
  guideProfileController,
} from "../../di/resolve";
import { BaseRoute } from "../base.route";

export class GuideRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get(
      "/guide/details",
      verifyAuth,
      asyncHandler(
        guideProfileController.getGuideProfile.bind(guideProfileController)
      )
    );

    this.router.put(
      "/guide/update-password",
      verifyAuth,
      asyncHandler(
        guideProfileController.updatePassword.bind(guideProfileController)
      )
    );

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
