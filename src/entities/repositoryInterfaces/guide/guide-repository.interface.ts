import { IGuideEntity } from "../../modelsEntity/guide.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGuideRepository extends IBaseRepository<IGuideEntity> {
  find(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    status: string,
    agencyId: any,
    languages ?: string[],
    minExperience ?: number,
    maxExperience ?: number,
    gender ?: string
  ): Promise<{ user: IGuideEntity[] | []; total: number }>;
  findByEmail(email: string): Promise<IGuideEntity | null>;
  findByNumber(phone: string): Promise<IGuideEntity | null>;
  findByIdAndUpdatePassword(
    id: any,
    password: string
  ): Promise<IGuideEntity | null>;
}
