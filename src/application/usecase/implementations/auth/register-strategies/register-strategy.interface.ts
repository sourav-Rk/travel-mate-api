import { IUserEntity } from "../../../../../domain/entities/user.entity";
import { UserDto } from "../../../../dto/response/user.dto";

export interface IRegisterStrategy {
    register(user : UserDto) : Promise<IUserEntity | void>;
}