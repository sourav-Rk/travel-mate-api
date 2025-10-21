export interface IMarkAllInstructionsReadUseCase{
    execute(userId: string): Promise<void>
}