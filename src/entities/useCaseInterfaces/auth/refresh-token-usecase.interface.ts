export interface IRefreshTokenUsecase{
    execute(refreshToken : string) : {role : string,accessToken : string};
}