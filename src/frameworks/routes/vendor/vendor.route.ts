import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  activityController,
  addressController,
  authController,
  blockMiddleware,
  guideController,
  itineraryController,
  kycController,
  packageConroller,
  vendorController,
  vendorProfileController,
} from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";
import { SignedUrlRoute } from "../common/signedUrl.route";

export class VendorRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use("/", new CommonUploadRoutes("vendor").router);

    this.router.use("/", new SignedUrlRoute("vendor").router);

    this.router
      .route("/vendor/package/:id")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(packageConroller.getPackageDetails.bind(packageConroller))
      )
      .put(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(packageConroller.updatePackage.bind(packageConroller))
      );

    this.router.put(
      "/vendor/itinerary/:id",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        itineraryController.updateItinerary.bind(itineraryController)
      )
    );

    this.router
      .route("/vendor/package")
      .post(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(packageConroller.addPackage.bind(packageConroller))
      )
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(packageConroller.getPackages.bind(packageConroller))
      );

    this.router.put(
      "/vendor/activity/:activityId",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(activityController.updateActivity.bind(activityController))
    );

    this.router.post(
      "/vendor/activity",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(activityController.createActivity.bind(activityController))
    );

    this.router.delete(
      "/vendor/activity",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(activityController.deleteActivity.bind(activityController))
    );

    this.router
      .route("/vendor/details")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(
          vendorProfileController.getVendorDetails.bind(vendorProfileController)
        )
      )
      .put(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(
          vendorProfileController.updateVendorProfile.bind(
            vendorProfileController
          )
        )
      );

    this.router.post(
      "/vendor/change-email",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.sendEmailOtp.bind(authController))
    );

    this.router.post(
      "/vendor/resent-otp",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.resendOtp.bind(authController))
    );

    this.router.post(
      "/vendor/verify-otp",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.verifyOtp.bind(authController))
    );

    this.router.put(
      "/vendor/update-password",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        vendorProfileController.updatePassword.bind(vendorProfileController)
      )
    );

    this.router.post(
      "/vendor/address",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(addressController.addAddress.bind(addressController))
    );

    this.router.put(
      "/vendor/address",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(addressController.updateAddress.bind(addressController))
    );

    this.router
      .route("/vendor/guide")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(guideController.getAllGuides.bind(guideController))
      )
      .post(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(guideController.addGuide.bind(guideController))
      );

    this.router.get(
      "/vendor/guide-details",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      guideController.getGuideDetails.bind(guideController)
    );

    this.router.post(
      "/vendor/kyc",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(kycController.addKyc.bind(kycController))
    );

    this.router.patch(
      "/vendor/status",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(vendorController.updateVendorStatus.bind(vendorController))
    );

    this.router.get(
      "/vendor/profile",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(vendorController.getDetailsforStatus.bind(vendorController))
    );

    this.router.post(
      "/vendor/logout",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.logout.bind(authController))
    );

    this.router.post(
      "/vendor/refresh-token",
      decodeToken,
      asyncHandler(authController.refreshToken.bind(authController))
    );
  }
}
