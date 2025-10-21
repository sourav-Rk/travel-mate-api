import { inject, injectable } from "tsyringe";
import { IGetInstructionsClientUsecase } from "../../interfaces/guide-instruction/get-instructions-client-usecase.interface";
import { IGuideInstructionRepository } from "../../../../domain/repositoryInterfaces/guide-instruction/guide-instruction-repository.interface";
import { IGuideInstructionEntity } from "../../../../domain/entities/guide-instruction.entity";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";

@injectable()
export class GetInstructionsClientUsecase implements IGetInstructionsClientUsecase {
  constructor(
    @inject("IGuideInstructionRepository")
    private _guideInstructionRepository: IGuideInstructionRepository,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
  ) {}

  async execute(userId: string): Promise<IGuideInstructionEntity[]> {
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const bookings = await this._bookingRepository.getAllBookingsByUserId(
      userId
    );

    const packageIds = bookings.map((bkg) => bkg.packageId);

    const instructions =
      await this._guideInstructionRepository.findAllInstructions(packageIds);

    return instructions;
  }
}
