export interface IForgotPasswordSendMailUsecase {
    execute(email : string) : Promise<void>;
}
