import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IGuideInstructionRepository } from "../../../../domain/repositoryInterfaces/guide-instruction/guide-instruction-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IMarkInstructionReadUseCase } from "../../interfaces/guide-instruction/mark-instruction-read-usecase.interface";

@injectable()
export class MarkInstructionReadUseCase implements IMarkInstructionReadUseCase {
  constructor(
    @inject("IGuideInstructionRepository")
    private guideInstructionRepository: IGuideInstructionRepository
  ) {}

  async execute(instructionId: string, userId: string): Promise<void> {
    if (!instructionId || !userId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const instruction = await this.guideInstructionRepository.findById(
      instructionId
    );

    if (!instruction) {
      throw new NotFoundError(
        ERROR_MESSAGE.GUIDE_INSTRUCTIONS.INSTRUCTION_NOT_FOUND
      );
    }

    if (instruction.readBy.includes(userId)) {
      return;
    }

    await this.guideInstructionRepository.addToReadBy(instructionId, userId);
  }
}
