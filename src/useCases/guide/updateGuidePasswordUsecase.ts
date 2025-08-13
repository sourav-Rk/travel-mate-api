import { inject, injectable } from "tsyringe";

import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IUpdateGuidePasswordUsecase } from "../../entities/useCaseInterfaces/guide/updateGuidePassword-usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { comparePassword, hashPassword } from "../../shared/utils/bcryptHelper";
import { CustomError } from "../../shared/utils/error/customError";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ValidationError } from "../../shared/utils/error/validationError";

@injectable()
export class UpdateGuidePasswordUsecase implements IUpdateGuidePasswordUsecase {
    constructor(
        @inject('IGuideRepository')
        private _guideRepository : IGuideRepository
    ){}

    async execute(id: any, currentPassword: string, newPassword: string): Promise<void> {
        if(!id || !currentPassword || !newPassword){
            throw new ValidationError("required fields are missing");
        }

        const guide = await this._guideRepository.findById(id);

        if(!guide){
            throw new NotFoundError("Guide not found");
        }

        const isPasswordMatch = await comparePassword(currentPassword,guide.password);

        if(!isPasswordMatch){
            throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.CURRENT_PASSWORD_WRONG);
        }

        const isCurrAndNewPassSame = await comparePassword(newPassword,guide.password);

        if(isCurrAndNewPassSame){
             throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.CURRENT_AND_NEW_SAME)
        }

        const hashedPassword = await hashPassword(newPassword);

        await this._guideRepository.findByIdAndUpdatePassword(id,hashedPassword);
    }
}