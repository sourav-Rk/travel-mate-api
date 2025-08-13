import { IGuideEntity } from "../../modelsEntity/guide.entity";

export interface IGuideRepository {
  find(
    filter: any,
    skip: number,
    limit: number
  ): Promise<{ user: IGuideEntity[] | []; total: number }>;
  findById(id : any) : Promise<IGuideEntity | null>;
  findByEmail(email: string): Promise<IGuideEntity | null>;
  findByNumber(phone: string): Promise<IGuideEntity | null>;
  save(data: Partial<IGuideEntity>): Promise<IGuideEntity>;
  findByIdAndUpdatePassword(
    id: any,
    password: string
  ): Promise<IGuideEntity | null>;
}
