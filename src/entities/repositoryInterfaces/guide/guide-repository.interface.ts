import { IGuideEntity } from "../../modelsEntity/guide.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGuideRepository extends IBaseRepository<IGuideEntity> {
  find(
    agencyId : string,
    searchTerm: string,
    status: string,
    validPageNumber: number,
    validPageSize: number
  ): Promise<{ user: IGuideEntity[] | []; total: number }>;
  findByEmail(email: string): Promise<IGuideEntity | null>;
  findByNumber(phone: string): Promise<IGuideEntity | null>;
  findByIdAndUpdatePassword(
    id: any,
    password: string
  ): Promise<IGuideEntity | null>;
}
