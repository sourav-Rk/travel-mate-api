import { RequestHandler } from "express";
import express from "express";

import {
  authorizeRole,
  decodeToken,
  verifyAuth,
} from "../../../interfaceAdapters/middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  authController,
  blockMiddleware,
  clientBookingController,
  clientPackageController,
  clientProfileController,
  notificationController,
  paymentController,
  reviewController,
  wishlistController,
} from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";
import { FcmTokenRoutes } from "../fcmToken/fcmToken.route";
import { injectable } from "tsyringe";


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

    // ----------------- Booking Routes -----------------

    // Get details of a specific booking by bookingId
    this.router.get(
      "/booking/:bookingId",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        clientBookingController.getBookingDetails.bind(clientBookingController)
      )
    );

    // Get booking details of a specific package
    this.router.get(
      "/booking/package/:packageId",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        clientBookingController.getBookingDetailOfPackage.bind(
          clientBookingController
        )
      )
    );

    // Get all bookings
    this.router.get(
      "/bookings",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        clientBookingController.getBookings.bind(clientBookingController)
      )
    );

    // Apply for a package
    this.router.post(
      "/booking/apply",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        clientBookingController.applyPackage.bind(clientBookingController)
      )
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
      asyncHandler(
        clientPackageController.getAvailablePackages.bind(
          clientPackageController
        )
      )
    );

    // ----------------- Profile Routes -----------------

    // Update or fetch client profile details
    this.router
      .route("/details")
      .put(
        verifyAuth,
        authorizeRole(["client"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(
          clientProfileController.updateClientProfile.bind(
            clientProfileController
          )
        )
      )
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(
          clientProfileController.getClientDetails.bind(clientProfileController)
        )
      );

    // Update client password
    this.router.put(
      "/update-password",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      blockMiddleware.checkBlockedStatus as RequestHandler,
      asyncHandler(clientProfileController.updatePassword.bind(clientProfileController))
    );

    // ----------------- Notification Routes -----------------

    // Mark a single notification as read
    this.router.patch(
      "/notifications/:notificationId",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        notificationController.markReadNotification.bind(notificationController)
      )
    );

    // Get all notifications or mark all as readdx
    this.router
      .route("/notifications")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(
          notificationController.getNotifications.bind(notificationController)
        )
      )
      .patch(
        verifyAuth,
        authorizeRole(["client"]),
        blockMiddleware.checkBlockedStatus,
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
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(paymentController.payAdvanceAmount.bind(paymentController))
    );

    // Pay full amount for a booking
    this.router.post(
      "/payment/full",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(paymentController.payFullAmount.bind(paymentController))
    );

    // Handle Stripe webhook events (raw body required)
    this.router.post(
      "/payment/webhook",
      express.raw({ type: "application/json" }),
      asyncHandler(paymentController.handleWebhook.bind(paymentController))
    );

    // ----------------- Wishlist Routes -----------------

    //get and add routes
    this.router
      .route("/wishlist")
      .get(
        verifyAuth,
        authorizeRole(["client"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(wishlistController.getWishlist.bind(wishlistController))
      )
      .put(
        verifyAuth,
        authorizeRole(["client"]),
        blockMiddleware.checkBlockedStatus,
        asyncHandler(wishlistController.addToWishlist.bind(wishlistController))
      );

    //to remove from the wishlist
    this.router.patch(
      "/wishlist/remove",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        wishlistController.removeFromWishlist.bind(wishlistController)
      )
    );

    // ----------------- Review Routes ----------------

    this.router.get(
      "/reviews/packages/:packageId",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(reviewController.getReviews.bind(reviewController))
    );

    this.router.post(
      "/review",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(reviewController.addReview.bind(reviewController))
    );

  }
}
