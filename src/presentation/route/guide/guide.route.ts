import { injectable } from "tsyringe";
import {
  authorizeRole,
  verifyAuth,
  verifyResetToken,
} from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  blockMiddleware,
  guideBookingController,
  guideController,
  guidePackageController,
  guideProfileController,
} from "../../../infrastructure/dependencyInjection/resolve";
import { BaseRoute } from "../base.route";

@injectable()
export class GuideRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.put(
      "/reset-password",
      verifyResetToken,
      asyncHandler(guideController.resetPassword.bind(guideController))
    );

    //middleware
    this.router.use(verifyAuth, authorizeRole(["guide"]));

    this.router.get(
      "/details",
      asyncHandler(
        guideProfileController.getGuideProfile.bind(guideProfileController)
      )
    );

    this.router.put(
      "/update-password",
      asyncHandler(
        guideProfileController.updatePassword.bind(guideProfileController)
      )
    );

    // -------------------------
    //  Package  Routes
    // -------------------------

    //get assigned packages
    this.router.get(
      "/assigned-packages",
      asyncHandler(
        guidePackageController.getAssignedPackages.bind(guidePackageController)
      )
    );

    //get package details
    this.router.get(
      "/package/:packageId",
      asyncHandler(
        guidePackageController.getPackageDetails.bind(guidePackageController)
      )
    );

    //update the status of the package
    this.router.put(
      "/package/status",
      asyncHandler(
        guidePackageController.updatePackageStatus.bind(guidePackageController)
      )
    );

    // -------------------------
    //  Booking  Routes
    // -------------------------

    //get bookings of a package
    this.router.get(
      "/bookings/:packageId",
      asyncHandler(
        guideBookingController.getBookingsOfThePackage.bind(
          guideBookingController
        )
      )
    );

    //get booking details
    this.router.get(
      "/bookings/user/:bookingId",
      asyncHandler(
        guideBookingController.getBookingDetailsGuide.bind(
          guideBookingController
        )
      )
    );
  }
}
