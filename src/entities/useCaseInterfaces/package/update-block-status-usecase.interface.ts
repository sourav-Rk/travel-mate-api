export interface IUpdateBlockStatusUsecase {
    execute(packageId : string) : Promise<void>;
}