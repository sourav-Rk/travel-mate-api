import { CreateInstructionDto } from "../../../dto/request/guide-instruction.dto";

export interface ICreateInstructionUsecase {
    execute(guideId : string,instructionData : CreateInstructionDto) : Promise<void>;
}