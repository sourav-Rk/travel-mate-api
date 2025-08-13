import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../entities/modelsEntity/user.entity";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client.repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dto/user.dto";
import { comparePassword } from "../../../shared/utils/bcryptHelper";
import { CustomError } from "../../../shared/utils/error/customError";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";

import { ILoginStrategy } from "./login-strategy.interface";

@injectable()
export class ClientLoginStrategy implements ILoginStrategy{
    constructor(
        @inject('IClientRepository')
        private clientRepository : IClientRepository
    ){}

    async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
        const client = await this.clientRepository.findByEmail(user.email);

        if(!client){
            throw new NotFoundError(ERROR_MESSAGE.EMAIL_NOT_FOUND);
        }

        if(client.isBlocked){
            throw new CustomError(HTTP_STATUS.FORBIDDEN,ERROR_MESSAGE.BLOCKED_ERROR) 
        };

        if(user.password){
            const isPasswordMatch = await comparePassword(user.password,client.password);

            if(!isPasswordMatch){
                throw new CustomError(HTTP_STATUS.BAD_REQUEST,ERROR_MESSAGE.INVALID_CREDENTIALS)
            }
        }
        return client
    } 
}