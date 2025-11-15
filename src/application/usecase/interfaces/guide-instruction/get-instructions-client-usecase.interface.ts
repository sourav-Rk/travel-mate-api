import { IGuideInstructionEntity } from "../../../../domain/entities/guide-instruction.entity";

export interface IGetInstructionsClientUsecase{
    execute(userId : string) : Promise<IGuideInstructionEntity[]>;
}