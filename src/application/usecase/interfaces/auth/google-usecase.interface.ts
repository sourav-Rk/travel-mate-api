import { IUserEntity } from "../../../../domain/entities/user.entity";

export interface IGoogleUsecase {
  execute(
    credential: string,
    client_id: string,
    role: "client"
  ): Promise<Partial<IUserEntity>>;
}
