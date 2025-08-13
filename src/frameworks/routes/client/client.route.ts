import { RequestHandler } from "express";

import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { authController, blockMiddleware, clientProfileController } from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";

export class ClientRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use("/", new CommonUploadRoutes("client").router);

    this.router
      .route("/client/details")
      .put(
        verifyAuth,
        authorizeRole(["client"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(
          clientProfileController.updateClientProfile.bind(
            clientProfileController
          )
        )
      )
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(
          clientProfileController.getClientDetails.bind(clientProfileController)
        )
      );

    this.router.put(
      "/client/update-password",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      blockMiddleware.checkBlockedStatus as RequestHandler,
      clientProfileController.updatePassword.bind(clientProfileController)
    );

    this.router.post(
      "/client/logout",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.logout.bind(authController))
    );

    this.router.post(
      "/client/refresh-token",
      decodeToken,
      asyncHandler(authController.refreshToken.bind(authController))
    );
  }
}
