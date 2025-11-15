import { IGuideInstructionEntity } from "../../entities/guide-instruction.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGuideInstructionRepository
  extends IBaseRepository<IGuideInstructionEntity> {
  findAllInstructions(
    packageIds: string[]
  ): Promise<IGuideInstructionEntity[] | []>;
  addToReadBy(instructionId: string, userId: string): Promise<void>;
  findByGuideId(guideId: string): Promise<IGuideInstructionEntity[]>;
  findByPackageId(packageId: string): Promise<IGuideInstructionEntity[]>;
}
