export interface IMarkInstructionReadUseCase{
    execute(instructionId: string, userId: string): Promise<void>;
}