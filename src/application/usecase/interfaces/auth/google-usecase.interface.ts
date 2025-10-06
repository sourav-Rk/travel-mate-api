import { IUserEntity } from "../../../../domain/entities/user.entity";

export interface IGoogleUsecase {
  execute(
    credential: any,
    client_id: any,
    role: any
  ): Promise<Partial<IUserEntity>>;
}
