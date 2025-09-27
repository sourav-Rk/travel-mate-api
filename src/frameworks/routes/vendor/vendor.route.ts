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

    this.router.use(verifyAuth,authorizeRole(["vendor"]),blockMiddleware.checkBlockedStatus);

    // -------------------------
    //  Booking Routes
    // -------------------------

    // Send payment alert for a booking
    this.router.put(
      "/bookings/:packageId/payment-alert",
      asyncHandler(
        vendorBookingController.sendPaymentAlert.bind(vendorBookingController)
      )
    );

    // Get details of a specific booking by bookingId
    this.router.get(
      "/bookings/users/:bookingId",
      asyncHandler(
        vendorBookingController.getBookingDetails.bind(vendorBookingController)
      )
    );

    // Get all bookings for a package
    this.router.get(
      "/bookings/:packageId",
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
      asyncHandler(packageConroller.updatePackageStatus.bind(packageConroller))
    );

    // Get or update package by ID
    this.router
      .route("/package/:id")
      .get(
        asyncHandler(packageConroller.getPackageDetails.bind(packageConroller))
      )
      .put(
        asyncHandler(packageConroller.updatePackage.bind(packageConroller))
      );

    // Add new package or get all packages
    this.router
      .route("/package")
      .post(
        asyncHandler(packageConroller.addPackage.bind(packageConroller))
      )
      .get(
        asyncHandler(packageConroller.getPackages.bind(packageConroller))
      );

    //Assign a guide to the package
    this.router.put(
      "/package/:packageId/assign-guide",
      asyncHandler(packageConroller.assignGuideToTrip.bind(packageConroller))
    );

    // -------------------------
    //  Itinerary Routes
    // -------------------------

    // Update itinerary by ID
    this.router.put(
      "/itinerary/:id",
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
      asyncHandler(activityController.updateActivity.bind(activityController))
    );
    // Create a new activity
    this.router.post(
      "/activity",
      asyncHandler(activityController.createActivity.bind(activityController))
    );

    // Delete an activity
    this.router.delete(
      "/activity",
      asyncHandler(activityController.deleteActivity.bind(activityController))
    );

    // -------------------------
    // Vendor Profile Routes
    // -------------------------

    // Get or update vendor profile details
    this.router
      .route("/details")
      .get(
        asyncHandler(
          vendorProfileController.getVendorDetails.bind(vendorProfileController)
        )
      )
      .put(
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
      asyncHandler(authController.sendEmailOtp.bind(authController))
    );

    this.router.post(
      "/resent-otp",
      asyncHandler(authController.resendOtp.bind(authController))
    );

    this.router.post(
      "/verify-otp",
      asyncHandler(authController.verifyOtp.bind(authController))
    );

    this.router.put(
      "/update-password",
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
      asyncHandler(addressController.addAddress.bind(addressController))
    );

    // Update existing address
    this.router.put(
      "/address",
      asyncHandler(addressController.updateAddress.bind(addressController))
    );

    this.router.post(
      "/kyc",
      asyncHandler(kycController.addKyc.bind(kycController))
    );

    // -------------------------
    //  Guide Routes
    // -------------------------

    // Get all guides or add a new guide
    this.router
      .route("/guide")
      .get(
        asyncHandler(guideController.getAllGuides.bind(guideController))
      )
      .post(
        asyncHandler(guideController.addGuide.bind(guideController))
      );

    // Get details of a specific guide
    this.router.get(
      "/guide-details",
      guideController.getGuideDetails.bind(guideController)
    );

    // -------------------------
    //  Vendor Management Routes
    // -------------------------

    // Update vendor status
    this.router.patch(
      "/status",
      asyncHandler(vendorController.updateVendorStatus.bind(vendorController))
    );

    // Get vendor profile for status
    this.router.get(
      "/profile",
      asyncHandler(vendorController.getDetailsforStatus.bind(vendorController))
    );

    // -------------------------
    //  Notification Routes
    // -------------------------

    // Mark a specific notification as read
    this.router.patch(
      "/notifications/:notificationId",
      asyncHandler(
        notificationController.markReadNotification.bind(notificationController)
      )
    );

    // Get all notifications or mark all as read
    this.router
      .route("/notifications")
      .get(
        asyncHandler(
          notificationController.getNotifications.bind(notificationController)
        )
      )
      .patch(
        asyncHandler(
          notificationController.markAsReadAllNotification.bind(
            notificationController
          )
        )
      );
  }
}
