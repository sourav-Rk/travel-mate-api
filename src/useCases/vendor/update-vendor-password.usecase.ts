import { inject, injectable } from "tsyringe";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { comparePassword, hashPassword } from "../../shared/utils/bcryptHelper";
import { IUpdateVendorPasswordUsecase } from "../../entities/useCaseInterfaces/vendor/update-vendor-password-usecase.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";

@injectable()
export class UpdateVendorPasswordUsecase implements IUpdateVendorPasswordUsecase {
    constructor(
         @inject('IVendorRepository')
         private _vendorRepository : IVendorRepository
    ){}
    
    async execute(id : any,currentPassword: string, newPassword: string): Promise<void> {
        const user = await this._vendorRepository.findById(id);

        if(!user){
            throw new CustomError(HTTP_STATUS.NOT_FOUND,"User not found");
        }

        const isPasswordMatch = await comparePassword(currentPassword,user.password);

        if(!isPasswordMatch){
            throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.CURRENT_PASSWORD_WRONG);
        }

        const isCurrAndNewPassSame = await comparePassword(newPassword,user.password);

        if(isCurrAndNewPassSame){
            throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.CURRENT_AND_NEW_SAME)
        }

        const hashedPassword = await hashPassword(newPassword)

        await this._vendorRepository.findByIdAndUpdatePassword(id,hashedPassword);
    }
}