import { injectable } from "tsyringe";
import {
  authorizeRole,
  verifyAuth,
  verifyResetToken,
} from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  blockMiddleware,
  chatController,
  guideBookingController,
  guideClientController,
  guideController,
  guidePackageController,
  guideProfileController,
} from "../../../infrastructure/dependencyInjection/resolve";
import { BaseRoute } from "../base.route";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import {
  ResetPasswordGuideDTO,
  UpdatePasswordGuideReqDTO,
} from "../../../application/dto/request/guide.dto";
import {
  GetAssignedPackagesReqDTO,
  UpdatePackageStatusReqDTO,
} from "../../../application/dto/request/package.dto";
import { GetBookingOfThePackageGuideReqDTO } from "../../../application/dto/request/booking.dto";
import { GetMessagesReqDto } from "../../../application/dto/request/chat.dto";

@injectable()
export class GuideRoute extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.put(
      "/reset-password",
      verifyResetToken,
      validationMiddleware(ResetPasswordGuideDTO),
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
      validationMiddleware(UpdatePasswordGuideReqDTO),
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
      validationMiddleware(GetAssignedPackagesReqDTO),
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
      validationMiddleware(UpdatePackageStatusReqDTO),
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
      validationMiddleware(GetBookingOfThePackageGuideReqDTO),
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

    // -------------------------
    //  User Details Routes
    // -------------------------
    this.router.get(
      "/client/:clientId",
      asyncHandler(
        guideClientController.getClientDetailsForGuide.bind(
          guideClientController
        )
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
  }
}
