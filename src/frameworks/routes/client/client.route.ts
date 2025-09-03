import { RequestHandler } from "express";

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
} from "../../di/resolve";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";
import { FcmTokenRoutes } from "../fcmToken/fcmToken.route";

export class ClientRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use("/", new CommonUploadRoutes("client").router);
    this.router.use("/", new FcmTokenRoutes("client").router);

    this.router.get(
      "/client/booking/:bookingId",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        clientBookingController.getBookingDetails.bind(clientBookingController)
      )
    );

    this.router.get(
      "/client/booking/package/:packageId",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        clientBookingController.getBookingDetailOfPackage.bind(
          clientBookingController
        )
      )
    );

    this.router.get(
      "/client/bookings",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        clientBookingController.getBookings.bind(clientBookingController)
      )
    );

    this.router.post(
      "/client/booking/apply",
      verifyAuth,
      authorizeRole(["client"]),
      asyncHandler(
        clientBookingController.applyPackage.bind(clientBookingController)
      )
    );

    this.router.get(
      "/client/packages/trending",
      asyncHandler(
        clientPackageController.getTrendingPackages.bind(
          clientPackageController
        )
      )
    );

    this.router.get(
      "/client/packages/:packageId",
      asyncHandler(
        clientPackageController.getPackageDetails.bind(clientPackageController)
      )
    );

    this.router.get(
      "/client/packages",
      asyncHandler(
        clientPackageController.getAvailablePackages.bind(
          clientPackageController
        )
      )
    );

    this.router
      .route("/client/details")
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

    this.router.put(
      "/client/update-password",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      blockMiddleware.checkBlockedStatus as RequestHandler,
      clientProfileController.updatePassword.bind(clientProfileController)
    );

    this.router.patch(
      "/client/notifications/:notificationId",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(
        notificationController.markReadNotification.bind(notificationController)
      )
    );

    this.router
      .route("/client/notifications")
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

    this.router.post(
      "/client/logout",
      verifyAuth,
      authorizeRole(["client"]),
      blockMiddleware.checkBlockedStatus,
      asyncHandler(authController.logout.bind(authController))
    );

    this.router.post(
      "/client/refresh-token",
      decodeToken,
      asyncHandler(authController.refreshToken.bind(authController))
    );
  }
}
