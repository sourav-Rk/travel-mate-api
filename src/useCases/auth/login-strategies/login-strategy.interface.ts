import { IUserEntity } from "../../../entities/modelsEntity/user.entity";
import { LoginUserDTO } from "../../../shared/dto/user.dto";

export interface ILoginStrategy{
    login(user : LoginUserDTO) : Promise<Partial<IUserEntity>>;
}