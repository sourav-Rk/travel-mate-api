import { IClientEntity } from "../../../../domain/entities/client.entity";

export interface IUpdateClientDetailsUsecase {
  execute(userId: any, data: Partial<IClientEntity>): Promise<void>;
}
