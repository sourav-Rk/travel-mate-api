import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../domain/errors/notFoundError";
import { ValidationError } from "../../../domain/errors/validationError";
import { IBookingRepository } from "../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IGroupChatRepository } from "../../../domain/repositoryInterfaces/group-chat/group-chat-repository.interface";
import { IGroupMessageRepository } from "../../../domain/repositoryInterfaces/group-chat/group-message-repository.interface";
import { IPackageRepository } from "../../../domain/repositoryInterfaces/package/package-repository.interface";
import { BOOKINGSTATUS, ERROR_MESSAGE } from "../../../shared/constants";
import { USER_TYPES } from "../../dto/request/admin.dto";
import { GroupChatMember } from "../../dto/response/groupChatDto";
import { IAddMemberUsecase } from "../../usecase/interfaces/group-chat/add-member-usecase.interface";
import { ICreateGroupChatUsecase } from "../../usecase/interfaces/group-chat/create-group-chat-usecase.interface";
import { IGroupChatService } from "../interfaces/group-chat-service.interface";

@injectable()
export class GroupChatService implements IGroupChatService {
  constructor(
    @inject("IGroupChatRepository")
    private _groupChatRepository: IGroupChatRepository,

    @inject("IGroupMessageRepository")
    private _groupMessageRepository: IGroupMessageRepository,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("ICreateGroupChatUsecase")
    private _createGroupChatUsecase: ICreateGroupChatUsecase,

    @inject("IAddMemberUsecase")
    private _addMemberUsecase: IAddMemberUsecase
  ) {}

  async handle(bookingId: string, packageId: string): Promise<void> {
    if (!bookingId || !packageId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const packageDetails = await this._packageRepository.findByPackageId(
      packageId
    );

    if (!packageDetails) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }

    const groupExist = await this._groupChatRepository.findByPackage(packageId);

    if (!groupExist) {
      const bookings = await this._bookingRepository.findByPackageIdAndStatus(
        packageId,
        BOOKINGSTATUS.FULLY_PAID
      );

      const members: GroupChatMember[] = bookings.map((booking) => ({
        userId: booking.userId,
        userType: USER_TYPES.CLIENT,
      }));

      members.push({
        userId: packageDetails.agencyId,
        userType: USER_TYPES.VENDOR,
      });

      if (packageDetails.guideId) {
        members.push({
          userId: packageDetails.guideId!,
          userType: USER_TYPES.GUIDE,
        });
      }

      await this._createGroupChatUsecase.execute({
        packageId,
        name: packageDetails.packageName,
        members,
      });
    } else {
      const bookingDetails =
        await this._bookingRepository.findByCustomBookingId(bookingId);
      if (!bookingDetails) {
        throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
      }
      await this._addMemberUsecase.execute(
        groupExist._id,
        bookingDetails?.userId
      );
    }
  }
}
