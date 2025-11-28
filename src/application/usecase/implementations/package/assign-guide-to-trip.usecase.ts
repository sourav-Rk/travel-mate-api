import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IGroupChatRepository } from "../../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { USER_TYPES } from "../../../dto/request/admin.dto";
import { GroupChatMember } from "../../../dto/response/groupChatDto";
import { IAssignGuideToTripUsecase } from "../../interfaces/package/assign-guide-to-trip-usecase.interface";
import { IRealTimeNotificationService } from "../../../../domain/service-interfaces/real-time-notification-service.interface";
import { NotificationData } from "../../../../infrastructure/service/real-time-notification.service";

@injectable()
export class AssignGuideToTripUsecase implements IAssignGuideToTripUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository,

    @inject("IRealTimeNotificationService")
    private _realtimeNotificationService: IRealTimeNotificationService,
  ) {}

  async execute(packageId: string, guideId: string): Promise<void> {
    //package and guide validation
    if (!guideId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const pkg = await this._packageRepository.findByPackageId(packageId);
    if (!pkg) throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);

    const guide = await this._guideRepository.findById(guideId);
    if (!guide) throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);

    //check already assigned
    if (pkg.guideId) {
      throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.GUIDE_ALREADY_ASSIGNED);
    }

    //check guide belongs to the agency
    if (pkg.agencyId.toString() !== guide.agencyId.toString()) {
      throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.GUIDE_AND_AGENCY_CONFLICT);
    }

    //Check package is not blocked or closed
    if (pkg.isBlocked) throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.PACKAGE_BLOCKED);
    if (pkg.status === "completed")
      throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.PACKAGE_ALREADY_COMPLETED);
    if (pkg.status !== "applications_closed")
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.ONLY_ASSIGN_GUIDE_IF_PACKAGE_IS_CLOSED,
      );

    //chekck for date conflicts
    const assignedTrips = await this._packageRepository.findByGuideId(guideId);

    const isConflict = assignedTrips.some((trip) => {
      return trip.startDate <= pkg.endDate && trip.endDate >= pkg.startDate;
    });

    if (isConflict) {
      throw new CustomError(HTTP_STATUS.CONFLICT, ERROR_MESSAGE.GUIDE_ASSIGNED_FOR_ANOTHER_TRIP);
    }

    //Asign guide
    await this._packageRepository.update(pkg._id!, { guideId });

    //add trips to assigned trips
    await this._guideRepository.pushAssignedTrip(guideId, pkg.packageId!);

    const notificationData: NotificationData = {
      title: "New Package Assigned",
      message: `${pkg.packageName} has been assigned to you.The trip is on ${pkg.startDate}`,
      type: "info",
    };

    await this._realtimeNotificationService.sendNotificationToUser(guideId, notificationData);

    const existingGroupChat = await this._groupChatRepository.findByPackage(pkg.packageId!);

    if (existingGroupChat) {
      const member: GroupChatMember = {
        userId: guideId,
        userType: USER_TYPES.GUIDE,
      };
      await this._groupChatRepository.addMember(existingGroupChat._id, member);
    }
  }
}
