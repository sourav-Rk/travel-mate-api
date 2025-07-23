import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { adminController, authController } from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { SignedUrlRoute } from "../common/signedUrl.route";

export class AdminRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {

    this.router.use("/", new SignedUrlRoute("admin").router)
   
    this.router.patch(
      "/admin/vendor-status",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(adminController.updateVendorStatus.bind(adminController))
    )

    this.router.get(
      "/admin/users",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(adminController.getAllUsers.bind(adminController))
    );

    this.router.get(
      "/admin/user-details",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(adminController.getUserDetails.bind(adminController))
    )

    this.router.patch(
      "/admin/user-status",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(adminController.updateUserStatus.bind(adminController))
    );

    this.router.post(
      "/admin/logout",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(authController.logout.bind(authController))
    );

    this.router.post(
      "/admin/refresh-token",
      decodeToken,
      asyncHandler(authController.refreshToken.bind(authController))
    );
  }
}
