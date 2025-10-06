import { IClientEntity } from "../../../../domain/entities/client.entity";

export interface IGetClientDetailsUsecase {
  execute(userId: string): Promise<IClientEntity | null>;
}
