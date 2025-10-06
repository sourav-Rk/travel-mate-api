import { injectable } from "tsyringe";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  adminController,
  authController,
  packageConroller,
} from "../../../infrastructure/dependencyInjection/resolve";
import { BaseRoute } from "../base.route";
import { SignedUrlRoute } from "../common/signedUrl.route";

@injectable()
export class AdminRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use("/", new SignedUrlRoute("admin").router);

    this.router.use(verifyAuth, authorizeRole(["admin"]));

    this.router.put(
      "/package/block",
      asyncHandler(packageConroller.updateBlockStatus.bind(packageConroller))
    );

    this.router.get(
      "/package/:id",
      asyncHandler(packageConroller.getPackageDetails.bind(packageConroller))
    );

    this.router.get(
      "/package",
      asyncHandler(packageConroller.getPackages.bind(packageConroller))
    );

    this.router.patch(
      "/vendor-status",
      asyncHandler(adminController.updateVendorStatus.bind(adminController))
    );

    this.router.get(
      "/users",
      asyncHandler(adminController.getAllUsers.bind(adminController))
    );

    this.router.get(
      "/user-details",
      asyncHandler(adminController.getUserDetails.bind(adminController))
    );

    this.router.patch(
      "/user-status",
      asyncHandler(adminController.updateUserStatus.bind(adminController))
    );
  }
}
