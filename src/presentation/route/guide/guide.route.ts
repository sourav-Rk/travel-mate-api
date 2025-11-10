import { injectable } from "tsyringe";

import { GetBookingOfThePackageGuideReqDTO } from "../../../application/dto/request/booking.dto";
import { GetMessagesReqDto } from "../../../application/dto/request/chat.dto";
import { CreateInstructionDto } from "../../../application/dto/request/guide-instruction.dto";
import {
  ResetPasswordGuideDTO,
  UpdatePasswordGuideReqDTO,
} from "../../../application/dto/request/guide.dto";
import {
  GetAssignedPackagesReqDTO,
  UpdatePackageStatusReqDTO,
} from "../../../application/dto/request/package.dto";
import {
  chatController,
  groupChatController,
  guideBookingController,
  guideClientController,
  guideController,
  guideInstructionController,
  guidePackageController,
  guideProfileController,
} from "../../../infrastructure/dependencyInjection/resolve";
import { asyncHandler } from "../../../shared/async-handler";
import {
  authorizeRole,
  verifyAuth,
  verifyResetToken,
} from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { BaseRoute } from "../base.route";
import { CommonUploadRoutes } from "../common/common-upload.route";

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

    // -------------------------
    //  Common Upload Routes
    // -------------------------
    this.router.use("/", new CommonUploadRoutes("guide").router);

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
    // Instruction Routes
    // -------------------------
    this.router.post(
      "/instructions",
      validationMiddleware(CreateInstructionDto),
      asyncHandler(
        guideInstructionController.createInstruction.bind(
          guideInstructionController
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
