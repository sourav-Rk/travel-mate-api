import { RequestHandler } from "express";
import express from "express";

import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  blockMiddleware,
  chatController,
  clientBookingController,
  clientPackageController,
  clientProfileController,
  guideProfileController,
  notificationController,
  paymentController,
  reviewController,
  wishlistController,
} from "../../../infrastructure/dependencyInjection/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";
import { FcmTokenRoutes } from "../fcmToken/fcmToken.route";
import { injectable } from "tsyringe";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import {
  UpdateClientProfileDTO,
  UpdatePasswordReqDTO,
} from "../../../application/dto/request/client.dto";
import { MarkReadNotificationReqDTO } from "../../../application/dto/request/notification.dto";
import { AddReviewReqDTO } from "../../../application/dto/request/review.dto";
import { GetAvailablePackagesReqDTO } from "../../../application/dto/request/package.dto";
import { BookingPaymentReqDTO } from "../../../application/dto/request/payment.dto";
import { GetGuideDetailsForClientReqDTO } from "../../../application/dto/request/guide.dto";
import { GetMessagesReqDto } from "../../../application/dto/request/chat.dto";

@injectable()
export class ClientRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    // Common file upload routes (for clients)
    this.router.use("/", new CommonUploadRoutes("client").router);

    // Routes to manage client FCM tokens (push notifications)
    this.router.use("/", new FcmTokenRoutes("client").router);

    //===========public routes=========================

    // Handle Stripe webhook events (raw body required)
    this.router.post(
      "/payment/webhook",
      express.raw({ type: "application/json" }),
      asyncHandler(paymentController.handleWebhook.bind(paymentController))
    );

    // ----------------- Package Routes -----------------

    // Get trending packages (public route)
    this.router.get(
      "/packages/trending",
      asyncHandler(
        clientPackageController.getTrendingPackages.bind(
          clientPackageController
        )
      )
    );

    // Get details of a specific package
    this.router.get(
      "/packages/:packageId",
      asyncHandler(
        clientPackageController.getPackageDetails.bind(clientPackageController)
      )
    );

    // Get list of all available packages
    this.router.get(
      "/packages",
      // validationMiddleware(GetAvailablePackagesReqDTO),
      asyncHandler(
        clientPackageController.getAvailablePackages.bind(
          clientPackageController
        )
      )
    );

    this.router.use(
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus
    );

    //==================Authenticated Routes=====================

    // ----------------- Booking Routes -----------------

    // Get details of a specific booking by bookingId
    this.router.get(
      "/booking/:bookingId",
      asyncHandler(
        clientBookingController.getBookingDetails.bind(clientBookingController)
      )
    );

    // Get booking details of a specific package
    this.router.get(
      "/booking/package/:packageId",
      asyncHandler(
        clientBookingController.getBookingDetailOfPackage.bind(
          clientBookingController
        )
      )
    );

    // Get all bookings
    this.router.get(
      "/bookings",
      asyncHandler(
        clientBookingController.getBookings.bind(clientBookingController)
      )
    );

    // Apply for a package
    this.router.post(
      "/booking/apply",
      asyncHandler(
        clientBookingController.applyPackage.bind(clientBookingController)
      )
    );

    // ----------------- Profile Routes -----------------

    // Update or fetch client profile details
    this.router
      .route("/details")
      .put(
        validationMiddleware(UpdateClientProfileDTO),
        asyncHandler(
          clientProfileController.updateClientProfile.bind(
            clientProfileController
          )
        )
      )
      .get(
        asyncHandler(
          clientProfileController.getClientDetails.bind(clientProfileController)
        )
      );

    // Update client password
    this.router.put(
      "/update-password",
      validationMiddleware(UpdatePasswordReqDTO),
      asyncHandler(
        clientProfileController.updatePassword.bind(clientProfileController)
      )
    );

    // ----------------- Notification Routes -----------------

    // Mark a single notification as read
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

    // ----------------- Payment Routes -----------------

    // Pay advance amount for a booking
    this.router.post(
      "/payment/advance",
      validationMiddleware(BookingPaymentReqDTO),
      asyncHandler(paymentController.payAdvanceAmount.bind(paymentController))
    );

    // Pay full amount for a booking
    this.router.post(
      "/payment/full",
      validationMiddleware(BookingPaymentReqDTO),
      asyncHandler(paymentController.payFullAmount.bind(paymentController))
    );

    // ----------------- Wishlist Routes -----------------

    //get and add routes
    this.router
      .route("/wishlist")
      .get(
        asyncHandler(wishlistController.getWishlist.bind(wishlistController))
      )
      .put(
        asyncHandler(wishlistController.addToWishlist.bind(wishlistController))
      );

    //to remove from the wishlist
    this.router.patch(
      "/wishlist/remove",
      asyncHandler(
        wishlistController.removeFromWishlist.bind(wishlistController)
      )
    );

    // ----------------- Review Routes ----------------

    //get guide reviews
    this.router.get(
      "/reviews/guides/:guideId/:packageId",
      asyncHandler(reviewController.getGuideReviews.bind(reviewController))
    );

    //get packages review
    this.router.get(
      "/reviews/packages/:packageId",
      asyncHandler(reviewController.getReviews.bind(reviewController))
    );

    this.router.post(
      "/review",
      validationMiddleware(AddReviewReqDTO),
      asyncHandler(reviewController.addReview.bind(reviewController))
    );

    // ----------------- Guide Routes ----------------
    this.router.get(
      "/guide/:guideId",
      validationMiddleware(GetGuideDetailsForClientReqDTO),
      asyncHandler(
        guideProfileController.getGuideDetailsForClient.bind(
          guideProfileController
        )
      )
    );

    //--------------=Chat Routes ---------------------
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
  }
}
