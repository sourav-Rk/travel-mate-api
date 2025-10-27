import { injectable } from "tsyringe";

import {
  GetAllUsersReqDTO,
  GetUserDetailsReqDTO,
  UpdateUserStatusReqDTO,
  UpdateVendorStatusReqDTO,
} from "../../../application/dto/request/admin.dto";
import {
  adminController,
  packageConroller,
  walletController,
} from "../../../infrastructure/dependencyInjection/resolve";
import { asyncHandler } from "../../../shared/async-handler";
import { authorizeRole, verifyAuth } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
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
      validationMiddleware(UpdateVendorStatusReqDTO),
      asyncHandler(adminController.updateVendorStatus.bind(adminController))
    );

    this.router.get(
      "/users",
      validationMiddleware(GetAllUsersReqDTO),
      asyncHandler(adminController.getAllUsers.bind(adminController))
    );

    this.router.get(
      "/user-details",
      validationMiddleware(GetUserDetailsReqDTO),
      asyncHandler(adminController.getUserDetails.bind(adminController))
    );

    this.router.patch(
      "/user-status",
      validationMiddleware(UpdateUserStatusReqDTO),
      asyncHandler(adminController.updateUserStatus.bind(adminController))
    );

    //----------wallet------------
    this.router.get(
      "/wallet",
      asyncHandler(walletController.getWalletByUserId.bind(walletController))
    );

    this.router.get(
      "/transactions",
      asyncHandler(
        walletController.getWalletTransactions.bind(walletController)
      )
    );
  }
}
