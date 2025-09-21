export interface ILogoutUsecase {
    execute(refreshToken : string,accessToken : string) : Promise<void>;
}