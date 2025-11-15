export interface IResetPasswordUsecase{
    execute(guideId : string,password : string,token : string) : Promise<void>;
}