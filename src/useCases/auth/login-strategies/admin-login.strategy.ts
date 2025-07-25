import { inject, injectable } from "tsyringe";
import { ILoginStrategy } from "./login-strategy.interface";
import { IAdminRepository } from "../../../entities/repositoryInterfaces/admin/admin-repository.interface";
import { IUserEntity } from "../../../entities/modelsEntity/user.entity";
import { LoginUserDTO } from "../../../shared/dto/user.dto";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
import { comparePassword } from "../../../shared/utils/bcryptHelper";
import { CustomError } from "../../../shared/utils/error/customError";

@injectable()
export class AdminLoginStrategy implements ILoginStrategy{
    constructor(
        @inject('IAdminRepository')
        private adminRepository : IAdminRepository
    ){}

    async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
        const admin = await this.adminRepository.findByEmail(user.email);

        if(!admin){
            throw new NotFoundError(ERROR_MESSAGE.EMAIL_NOT_FOUND)
        }

        if(user.password){
            const isPasswordMatch = comparePassword(user.password,admin.password);

            if(!isPasswordMatch){
                throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.INVALID_CREDENTIALS)
            }
        }

        return admin
    }
}