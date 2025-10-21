import { inject, injectable } from "tsyringe";
import { ICreateInstructionUsecase } from "../../interfaces/guide-instruction/create-instruction-usecase.interface";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { CreateInstructionDto } from "../../../dto/request/guide-instruction.dto";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IGuideInstructionRepository } from "../../../../domain/repositoryInterfaces/guide-instruction/guide-instruction-repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IGuideInstructionEntity } from "../../../../domain/entities/guide-instruction.entity";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { CustomError } from "../../../../domain/errors/customError";

@injectable()
export class CreateInstructionUsecase implements ICreateInstructionUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IGuideInstructionRepository")
    private _guideInstructionRepository: IGuideInstructionRepository,

    @inject('IPackageRepository')
    private _packageRepository : IPackageRepository
  ) {}

  async execute(
    guideId: string,
    instructionData: CreateInstructionDto
  ): Promise<void> {
    const guide = await this._guideRepository.findById(guideId);
    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    const packageDetails = await this._packageRepository.findByPackageId(instructionData.packageId);

    if(!packageDetails){
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE_NOT_FOUND);
    }


    const bookings = await this._bookingRepository.findByPackageId(
      instructionData.packageId
    );

    if (bookings.length === 0) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_INSTRUCTIONS.NO_TRAVELLERS_FOUND);
    }

    const instruction = await this._guideInstructionRepository.save({
      guideId,
      packageId: instructionData.packageId,
      title: instructionData.title,
      message: instructionData.message,
      type: instructionData.type,
      priority: instructionData.priority || "MEDIUM",
      location: instructionData.location,
      sentAt: new Date(),
      readBy: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
