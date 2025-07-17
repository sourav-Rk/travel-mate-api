import { LoginUserDTO } from "../../../shared/dto/user.dto";
import { IUserEntity } from "../../modelsEntity/user.entity";

export interface ILoginUsecase{
    execute(data : LoginUserDTO) : Promise<Partial<IUserEntity>>;
}