import { IUserEntity } from "../../../../domain/entities/user.entity";
import { LoginUserDTO } from "../../../dto/response/user.dto";

export interface ILoginUsecase {
  execute(data: LoginUserDTO): Promise<Partial<IUserEntity>>;
}
