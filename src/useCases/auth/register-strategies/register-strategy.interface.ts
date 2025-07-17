import { IUserEntity } from "../../../entities/modelsEntity/user.entity";
import { UserDto } from "../../../shared/dto/user.dto";

export interface IRegisterStrategy {
    register(user : UserDto) : Promise<IUserEntity | void>;
}