import { injectable } from "tsyringe";
import {
  authorizeRole,
  verifyAuth,
  verifyResetToken,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { guideController, guideProfileController } from "../../di/resolve";
import { BaseRoute } from "../base.route";

@injectable()
export class GuideRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get(
      "/details",
      verifyAuth,
      authorizeRole(["guide"]),
      asyncHandler(
        guideProfileController.getGuideProfile.bind(guideProfileController)
      )
    );

    this.router.put(
      "/update-password",
      verifyAuth,
      authorizeRole(["guide"]),
      asyncHandler(
        guideProfileController.updatePassword.bind(guideProfileController)
      )
    );

    this.router.post(
      "/reset-password",
      verifyResetToken,
      asyncHandler(guideController.resetPassword.bind(guideController))
    );
  }
}
