export interface IBlackListTokenUsecase{
    execute(token : string) : Promise<void>;
}