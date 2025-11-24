import { injectable } from "tsyringe";

import {
  GetAllUsersReqDTO,
  GetUserDetailsReqDTO,
  UpdateUserStatusReqDTO,
  UpdateVendorStatusReqDTO,
  GetDashboardStatsReqDTO,
  GetAdminSalesReportReqDTO,
} from "../../../application/dto/request/admin.dto";
import { CreateBadgeReqDTO, GetBadgesReqDTO, UpdateBadgeReqDTO } from "../../../application/dto/request/badge.dto";
import { GetPendingVerificationsReqDTO } from "../../../application/dto/request/local-guide.dto";
import {
  adminController,
  badgeController,
  localGuideController,
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

    // Dashboard statistics
    this.router.get(
      "/dashboard/stats",
      validationMiddleware(GetDashboardStatsReqDTO),
      asyncHandler(adminController.getDashboardStats.bind(adminController))
    );

    // Sales Report
    this.router.get(
      "/sales-report",
      validationMiddleware(GetAdminSalesReportReqDTO),
      asyncHandler(adminController.getSalesReport.bind(adminController))
    );

    // Local Guide Verification Routes
    this.router.get(
      "/local-guides/pending",
      validationMiddleware(GetPendingVerificationsReqDTO),
      asyncHandler(
        localGuideController.getPendingVerifications.bind(localGuideController)
      )
    );

    this.router.patch(
      "/local-guides/verify/:profileId",
      asyncHandler(
        localGuideController.verifyGuide.bind(localGuideController)
      )
    );

    this.router.patch(
      "/local-guides/reject/:profileId",
      asyncHandler(
        localGuideController.rejectGuide.bind(localGuideController)
      )
    );

    //-------------- Badge Management Routes -----------------
    this.router.post(
      "/badges",
      validationMiddleware(CreateBadgeReqDTO),
      asyncHandler(badgeController.createBadge.bind(badgeController))
    );

    this.router.put(
      "/badges/:badgeId",
      validationMiddleware(UpdateBadgeReqDTO),
      asyncHandler(badgeController.updateBadge.bind(badgeController))
    );

    this.router.delete(
      "/badges/:badgeId",
      asyncHandler(badgeController.deleteBadge.bind(badgeController))
    );

    this.router.get(
      "/badges",
      validationMiddleware(GetBadgesReqDTO),
      asyncHandler(badgeController.getAllBadges.bind(badgeController))
    );

    this.router.get(
      "/badges/:badgeId",
      asyncHandler(badgeController.getBadgeById.bind(badgeController))
    );
  }
}
