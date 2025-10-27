import { IGuideEntity } from "../../entities/guide.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IGuideRepository extends IBaseRepository<IGuideEntity> {
  find(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    status: string,
    agencyId: string,
    languages?: string[],
    minExperience?: number,
    maxExperience?: number,
    gender?: string
  ): Promise<{ user: IGuideEntity[] | []; total: number }>;
  findByEmail(email: string): Promise<IGuideEntity | null>;
  findByNumber(phone: string): Promise<IGuideEntity | null>;
  findByIdAndUpdatePassword(
    id: string,
    password: string
  ): Promise<IGuideEntity | null>;
}
