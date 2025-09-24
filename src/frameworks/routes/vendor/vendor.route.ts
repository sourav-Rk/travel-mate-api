import { injectable } from "tsyringe";
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
  notificationController,
  packageConroller,
  vendorBookingController,
  vendorController,
  vendorProfileController,
} from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";
import { SignedUrlRoute } from "../common/signedUrl.route";
import { FcmTokenRoutes } from "../fcmToken/fcmToken.route";

@injectable()
export class VendorRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    // -------------------------
    //  Common Upload & Utilities Routes
    // -------------------------
    this.router.use("/", new CommonUploadRoutes("vendor").router);
    this.router.use("/", new SignedUrlRoute("vendor").router);
    this.router.use("/", new FcmTokenRoutes("vendor").router);

    // -------------------------
    //  Booking Routes
    // -------------------------

    // Send payment alert for a booking
    this.router.put(
      "/bookings/:packageId/payment-alert",
      verifyAuth,
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        vendorBookingController.sendPaymentAlert.bind(vendorBookingController)
      )
    );

    // Get details of a specific booking by bookingId
    this.router.get(
      "/bookings/users/:bookingId",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        vendorBookingController.getBookingDetails.bind(vendorBookingController)
      )
    );

    // Get all bookings for a package
    this.router.get(
      "/bookings/:packageId",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        vendorBookingController.getBookings.bind(vendorBookingController)
      )
    );

    // -------------------------
    //  Package Routes
    // -------------------------

    // Update package status (active/inactive)
    this.router.put(
      "/package/status",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(packageConroller.updatePackageStatus.bind(packageConroller))
    );

    // Get or update package by ID
    this.router
      .route("/package/:id")
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

    // Add new package or get all packages
    this.router
      .route("/package")
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

    //Assign a guide to the package
    this.router.put(
      "/package/:packageId/assign-guide",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(packageConroller.assignGuideToTrip.bind(packageConroller))
    );

    // -------------------------
    //  Itinerary Routes
    // -------------------------

    // Update itinerary by ID
    this.router.put(
      "/itinerary/:id",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        itineraryController.updateItinerary.bind(itineraryController)
      )
    );

    // -------------------------
    // Activity Routes
    // -------------------------
    // Update an existing activity
    this.router.put(
      "/activity/:activityId",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(activityController.updateActivity.bind(activityController))
    );
    // Create a new activity
    this.router.post(
      "/activity",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(activityController.createActivity.bind(activityController))
    );

    // Delete an activity
    this.router.delete(
      "/activity",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(activityController.deleteActivity.bind(activityController))
    );

    // -------------------------
    // Vendor Profile Routes
    // -------------------------

    // Get or update vendor profile details
    this.router
      .route("/details")
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

    // -------------------------
    // Authentication Routes
    // -------------------------

    // Update vendor password
    this.router.post(
      "/change-email",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.sendEmailOtp.bind(authController))
    );

    this.router.post(
      "/resent-otp",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.resendOtp.bind(authController))
    );

    this.router.post(
      "/verify-otp",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.verifyOtp.bind(authController))
    );

    this.router.put(
      "/update-password",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        vendorProfileController.updatePassword.bind(vendorProfileController)
      )
    );

    // -------------------------
    //  Address Routes And Kyc Routes
    // -------------------------

    // Add new address
    this.router.post(
      "/address",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(addressController.addAddress.bind(addressController))
    );

    // Update existing address
    this.router.put(
      "/address",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(addressController.updateAddress.bind(addressController))
    );

    this.router.post(
      "/kyc",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(kycController.addKyc.bind(kycController))
    );

    // -------------------------
    //  Guide Routes
    // -------------------------

    // Get all guides or add a new guide
    this.router
      .route("/guide")
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

    // Get details of a specific guide
    this.router.get(
      "/guide-details",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      guideController.getGuideDetails.bind(guideController)
    );

    // -------------------------
    //  Vendor Management Routes
    // -------------------------

    // Update vendor status
    this.router.patch(
      "/status",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(vendorController.updateVendorStatus.bind(vendorController))
    );

    // Get vendor profile for status
    this.router.get(
      "/profile",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(vendorController.getDetailsforStatus.bind(vendorController))
    );

    // -------------------------
    //  Notification Routes
    // -------------------------

    // Mark a specific notification as read
    this.router.patch(
      "/notifications/:notificationId",
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        notificationController.markReadNotification.bind(notificationController)
      )
    );

    // Get all notifications or mark all as read
    this.router
      .route("/notifications")
      .get(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(
          notificationController.getNotifications.bind(notificationController)
        )
      )
      .patch(
        verifyAuth,
        authorizeRole(["vendor"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(
          notificationController.markAsReadAllNotification.bind(
            notificationController
          )
        )
      );
  }
}
