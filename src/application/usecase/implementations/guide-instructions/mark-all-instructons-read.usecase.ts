import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IGuideInstructionRepository } from "../../../../domain/repositoryInterfaces/guide-instruction/guide-instruction-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IMarkAllInstructionsReadUseCase } from "../../interfaces/guide-instruction/mark-all-instructions-usecase.interface";

@injectable()
export class MarkAllInstructionsReadUseCase
  implements IMarkAllInstructionsReadUseCase
{
  constructor(
    @inject("IGuideInstructionRepository")
    private guideInstructionRepository: IGuideInstructionRepository,

    @inject("IBookingRepository")
    private bookingRepository: IBookingRepository
  ) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const userBookings = await this.bookingRepository.getAllBookingsByUserId(
      userId
    );
    const packageIds = userBookings.map((booking) => booking.packageId);

    if (packageIds.length === 0) {
      return;
    }

    const instructions =
      await this.guideInstructionRepository.findAllInstructions(packageIds);

    // Filter unread instructions
    const unreadInstructions = instructions.filter(
      (instruction) => !instruction.readBy.includes(userId)
    );

    if (unreadInstructions.length === 0) {
      return;
    }

    // Mark all unread instructions as read
    const markPromises = unreadInstructions.map((instruction) =>
      this.guideInstructionRepository.addToReadBy(instruction._id!, userId)
    );

    await Promise.all(markPromises);
  }
}
