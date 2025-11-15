export interface IMarkAsAllReadUsecase{
    execute(userId : string) : Promise<void>;
}