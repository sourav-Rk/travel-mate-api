import { IGuideEntity } from "../../modelsEntity/guide.entity";

export interface IGuideRepository {
  find(
    agencyId : string,
    searchTerm: string,
    status: string,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IGuideEntity[] | []; total: number }>;
  findById(id: any): Promise<IGuideEntity | null>;
  findByEmail(email: string): Promise<IGuideEntity | null>;
  findByNumber(phone: string): Promise<IGuideEntity | null>;
  save(data: Partial<IGuideEntity>): Promise<IGuideEntity>;
  findByIdAndUpdatePassword(
    id: any,
    password: string
  ): Promise<IGuideEntity | null>;
}
