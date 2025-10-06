import { LoginUserDTO } from "../../../dto/response/user.dto";
import { IUserEntity } from "../../../../domain/entities/user.entity";

export interface ILoginUsecase {
  execute(data: LoginUserDTO): Promise<Partial<IUserEntity>>;
}
