export interface ISendEmailOtpUsecase {
    execute(email : string) : Promise<void>;
}