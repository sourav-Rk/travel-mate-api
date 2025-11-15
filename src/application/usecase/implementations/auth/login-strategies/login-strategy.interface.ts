import { IUserEntity } from "../../../../../domain/entities/user.entity";
import { LoginUserDTO } from "../../../../dto/response/user.dto";

export interface ILoginStrategy {
  login(user: LoginUserDTO): Promise<Partial<IUserEntity>>;
}
