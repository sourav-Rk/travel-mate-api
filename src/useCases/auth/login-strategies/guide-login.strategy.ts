import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../entities/modelsEntity/user.entity";
import { IGuideRepository } from "../../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dto/user.dto";
import { comparePassword } from "../../../shared/utils/bcryptHelper";
import { CustomError } from "../../../shared/utils/error/customError";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";

import { ILoginStrategy } from "./login-strategy.interface";

@injectable()
export class GuideLoginStrategy implements ILoginStrategy{
    constructor(
        @inject('IGuideRepository')
        private _guideRepository : IGuideRepository
    ){}

    async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
        const guide = await this._guideRepository.findByEmail(user.email);

        console.log(guide,"-->guide")

        if(!guide){
            throw new NotFoundError(ERROR_MESSAGE.EMAIL_NOT_FOUND)
        }

        if(guide?.isBlocked){
           throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.BLOCKED_ERROR)
        };

        if(user.password){
            const isPasswordMatch = await comparePassword(user.password,guide.password);

            if(!isPasswordMatch){
                throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.INVALID_CREDENTIALS);
            }
        }
        return guide
    }
}