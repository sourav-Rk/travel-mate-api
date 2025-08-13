import { inject, injectable } from "tsyringe";

import { IUserEntity } from "../../../entities/modelsEntity/user.entity";
import { IClientRepository } from "../../../entities/repositoryInterfaces/client/client.repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants";
import { LoginUserDTO } from "../../../shared/dto/user.dto";
import { CustomError } from "../../../shared/utils/error/customError";

import { ILoginStrategy } from "./login-strategy.interface";

@injectable()
export class ClientGoogleLoginStrategy implements ILoginStrategy{
    constructor(
        @inject('IClientRepository')
        private _clientRepository : IClientRepository
    ){}

    async login(user: LoginUserDTO): Promise<Partial<IUserEntity>> {
        const client = await this._clientRepository.findByEmail(user.email);

        if(client){
            if(client.isBlocked){
                throw new CustomError(HTTP_STATUS.FORBIDDEN,ERROR_MESSAGE.BLOCKED_ERROR)
            }
        }
        return client as Partial<IUserEntity>;
    }
}