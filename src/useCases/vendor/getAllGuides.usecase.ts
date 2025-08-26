import { inject, injectable } from "tsyringe";

import { PaginatedUsers } from "../../entities/modelsEntity/paginated-users.entity";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IGetAllGuidesUsecase } from "../../entities/useCaseInterfaces/vendor/getAllGuides-usecase.interface";
import { GuideMapper } from "../../interfaceAdapters/mappers/guide.mapper";

@injectable()
export class GetAllGuideUsecase implements IGetAllGuidesUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    searchTerm: string,
    status: string,
    agencyId: any
  ): Promise<PaginatedUsers> {
    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);

    const { user, total } = await this._guideRepository.find(
      agencyId,
      searchTerm,
      status,
      validPageNumber,
      validPageSize
    );


    const users = user.map((doc) => GuideMapper.mapGuideToVendorTableDto(doc));
    return { user: users, total };
  }
}
