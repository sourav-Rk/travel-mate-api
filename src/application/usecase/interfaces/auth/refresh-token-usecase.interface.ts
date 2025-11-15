export interface IRefreshTokenUsecase{
    execute(refreshToken : string) : Promise<{role : string,accessToken : string}>;
}