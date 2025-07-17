import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { authController } from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";

export class ClientRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use("/", new CommonUploadRoutes("client").router);
    
    this.router.post(
      "/client/logout",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(authController.logout.bind(authController))
    );

    this.router.post(
      "/client/refresh-token",
      decodeToken,
      asyncHandler(authController.refreshToken.bind(authController))
    );
  }
}
