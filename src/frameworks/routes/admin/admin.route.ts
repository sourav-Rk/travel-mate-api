import { injectable } from "tsyringe";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  adminController,
  authController,
  packageConroller,
} from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { SignedUrlRoute } from "../common/signedUrl.route";

@injectable()
export class AdminRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use("/", new SignedUrlRoute("admin").router);

    this.router.put(
      "/package/block",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(packageConroller.updateBlockStatus.bind(packageConroller))
    );

    this.router.get(
      "/package/:id",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(packageConroller.getPackageDetails.bind(packageConroller))
    );

    this.router.get(
      "/package",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(packageConroller.getPackages.bind(packageConroller))
    );

    this.router.patch(
      "/vendor-status",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(adminController.updateVendorStatus.bind(adminController))
    );

    this.router.get(
      "/users",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(adminController.getAllUsers.bind(adminController))
    );

    this.router.get(
      "/user-details",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(adminController.getUserDetails.bind(adminController))
    );

    this.router.patch(
      "/user-status",
      verifyAuth,
      authorizeRole(["admin"]),
      asyncHandler(adminController.updateUserStatus.bind(adminController))
    );
  }
}
