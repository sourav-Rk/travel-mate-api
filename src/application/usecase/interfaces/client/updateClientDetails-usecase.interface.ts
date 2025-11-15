import { IClientEntity } from "../../../../domain/entities/client.entity";

export interface IUpdateClientDetailsUsecase {
  execute(userId: string, data: Partial<IClientEntity>): Promise<void>;
}
