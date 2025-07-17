import { inject, injectable } from "tsyringe";
import { IRefreshTokenUsecase } from "../../entities/useCaseInterfaces/auth/refresh-token-usecase.interface";
import { ITokenService } from "../../entities/serviceInterfaces/token-service.interface";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { JwtPayload } from "jsonwebtoken";

@injectable()
export class RefreshTokenUsecase implements IRefreshTokenUsecase{
    constructor(
        @inject('ITokenService')
        private TokenService : ITokenService
    ){}

    execute(refreshToken: string): { role: string; accessToken: string; } {
        const payload = this.TokenService.verifyRefreshToken(refreshToken);

        if(!payload){
            throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.INVALID_REFRESH_TOKEN);
        }

        return{
            role : (payload as JwtPayload).role,
            accessToken : this.TokenService.generateAccessToken({
                id : (payload as JwtPayload).id,
                email : (payload as JwtPayload).email,
                role : (payload as JwtPayload).role,
            })
        }
    }
}