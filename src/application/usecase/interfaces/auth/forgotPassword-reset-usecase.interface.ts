export interface IForgotPasswordResetUsecase{
    execute(token : string,password : string,confirmPassword : string) : Promise<void>;
}