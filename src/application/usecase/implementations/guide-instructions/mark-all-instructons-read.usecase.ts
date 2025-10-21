import { inject, injectable } from "tsyringe";

import { IGuideInstructionRepository } from "../../../../domain/repositoryInterfaces/guide-instruction/guide-instruction-repository.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IMarkAllInstructionsReadUseCase } from "../../interfaces/guide-instruction/mark-all-instructions-usecase.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";

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
      console.log(
        `User ${userId} has no bookings, no instructions to mark as read`
      );
      return;
    }

    const instructions =
      await this.guideInstructionRepository.findAllInstructions(packageIds);

    // Filter unread instructions
    const unreadInstructions = instructions.filter(
      (instruction) => !instruction.readBy.includes(userId)
    );

    if (unreadInstructions.length === 0) {
      console.log(`User ${userId} has no unread instructions`);
      return;
    }

    // Mark all unread instructions as read
    const markPromises = unreadInstructions.map((instruction) =>
      this.guideInstructionRepository.addToReadBy(instruction._id!, userId)
    );

    await Promise.all(markPromises);

    console.log(
      `Marked ${unreadInstructions.length} instructions as read for user ${userId}`
    );
  }
}
