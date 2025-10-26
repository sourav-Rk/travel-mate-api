import { injectable } from "tsyringe";
import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  activityController,
  addressController,
  authController,
  blockMiddleware,
  chatController,
  clientProfileController,
  groupChatController,
  guideController,
  itineraryController,
  kycController,
  notificationController,
  packageConroller,
  vendorBookingController,
  vendorController,
  vendorProfileController,
  walletController,
} from "../../../infrastructure/dependencyInjection/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";
import { SignedUrlRoute } from "../common/signedUrl.route";
import { FcmTokenRoutes } from "../fcmToken/fcmToken.route";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { GetBookingsVendorReqDTO } from "../../../application/dto/request/booking.dto";
import { GetPackagesVendorReqDTO } from "../../../application/dto/request/package.dto";
import {
  ChangeEmailReqDto,
  UpdatePasswordVendorDTO,
  VendorProfileReqDTO,
} from "../../../application/dto/request/vendor.dto";
import {
  OtpReqDTO,
  ResendOtpReqDTO,
} from "../../../application/dto/request/auth.dto";
import {
  AddAddressReqDTO,
  UpdateAddressReqDTO,
} from "../../../application/dto/request/address.dto";
import { AddKycReqDTO } from "../../../application/dto/request/kyc.dto";
import { AddGuideReqDTO } from "../../../application/dto/request/guide.dto";
import { UpdateVendorStatusReqDTO } from "../../../application/dto/request/admin.dto";
import { MarkReadNotificationReqDTO } from "../../../application/dto/request/notification.dto";
import { GetMessagesReqDto } from "../../../application/dto/request/chat.dto";

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

    this.router.use(
      verifyAuth,
      authorizeRole(["vendor"]),
      blockMiddleware.checkBlockedStatus
    );

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
      validationMiddleware(GetBookingsVendorReqDTO),
      asyncHandler(
        vendorBookingController.getBookings.bind(vendorBookingController)
      )
    );

    //verify cancellation
    this.router.post(
      "/bookings/verify-cancellation/:bookingId",
      asyncHandler(
        vendorBookingController.verifyBookingCancellation.bind(
          vendorBookingController
        )
      )
    );

    //get cancellation-requests
    this.router.get(
      "/cancellation-requests",
      asyncHandler(
        vendorBookingController.getCancellationRequests.bind(
          vendorBookingController
        )
      )
    );

    //get cancelled booking details
    this.router.get(
      "/bookings/:bookingId/cancelled",
      asyncHandler(
        vendorBookingController.getCancelledBookingDetails.bind(
          vendorBookingController
        )
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
      .put(asyncHandler(packageConroller.updatePackage.bind(packageConroller)));

    // Add new package or get all packages
    this.router
      .route("/package")
      .post(asyncHandler(packageConroller.addPackage.bind(packageConroller)))
      .get(
        validationMiddleware(GetPackagesVendorReqDTO),
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
        validationMiddleware(VendorProfileReqDTO),
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
      validationMiddleware(ChangeEmailReqDto),
      asyncHandler(authController.sendEmailOtp.bind(authController))
    );

    this.router.post(
      "/resent-otp",
      validationMiddleware(ResendOtpReqDTO),
      asyncHandler(authController.resendOtp.bind(authController))
    );

    this.router.post(
      "/verify-otp",
      validationMiddleware(OtpReqDTO),
      asyncHandler(authController.verifyOtp.bind(authController))
    );

    this.router.put(
      "/update-password",
      validationMiddleware(UpdatePasswordVendorDTO),
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
      validationMiddleware(AddAddressReqDTO),
      asyncHandler(addressController.addAddress.bind(addressController))
    );

    // Update existing address
    this.router.put(
      "/address",
      validationMiddleware(UpdateAddressReqDTO),
      asyncHandler(addressController.updateAddress.bind(addressController))
    );

    this.router.post(
      "/kyc",
      validationMiddleware(AddKycReqDTO),
      asyncHandler(kycController.addKyc.bind(kycController))
    );

    // -------------------------
    //  Guide Routes
    // -------------------------

    // Get all guides or add a new guide
    this.router
      .route("/guide")
      .get(asyncHandler(guideController.getAllGuides.bind(guideController)))
      .post(
        validationMiddleware(AddGuideReqDTO),
        asyncHandler(guideController.addGuide.bind(guideController))
      );

    // Get details of a specific guide
    this.router.get(
      "/guide-details",
      asyncHandler(guideController.getGuideDetails.bind(guideController))
    );

    // -------------------------
    //  Vendor Management Routes
    // -------------------------

    // Update vendor status
    this.router.patch(
      "/status",
      validationMiddleware(UpdateVendorStatusReqDTO),
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
      validationMiddleware(MarkReadNotificationReqDTO),
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

    // -------------------------
    //  Wallet Routes
    // -------------------------
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

    // -------------------------
    //  Chat Routes
    // -------------------------
    this.router.get(
      "/messages",
      validationMiddleware(GetMessagesReqDto),
      asyncHandler(chatController.getMessages.bind(chatController))
    );

    this.router.get(
      "/chatroom/:chatroomId",
      asyncHandler(chatController.getChatroom.bind(chatController))
    );

    this.router.get(
      "/history",
      asyncHandler(chatController.getChatHistory.bind(chatController))
    );

    // -------------------------
    //  Cliet details Routes
    // -------------------------
    this.router.get(
      "/client/:clientId",
      asyncHandler(
        clientProfileController.getClientDetailsVendor.bind(
          clientProfileController
        )
      )
    );

    //--------------Group Chat routes-------------------

    this.router.get(
      "/groups",
      asyncHandler(groupChatController.getGroups.bind(groupChatController))
    );

    this.router.get(
      "/group-details/:groupId",
      asyncHandler(
        groupChatController.getGroupDetails.bind(groupChatController)
      )
    );
  }
}
