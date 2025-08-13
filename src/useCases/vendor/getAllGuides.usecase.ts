import { inject, injectable } from "tsyringe";

import { PaginatedUsers } from "../../entities/modelsEntity/paginated-users.entity";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IGetAllGuidesUsecase } from "../../entities/useCaseInterfaces/vendor/getAllGuides-usecase.interface";

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
    const filter: any = { agencyId };

    if (searchTerm) {
      filter.$or = [
        { firstName: { $regex: searchTerm, $options: "i" } },
        { lastName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);
    const skip = (validPageNumber - 1) * validPageSize;
    const limit = validPageSize;

    const { user, total } = await this._guideRepository.find(
      filter,
      skip,
      limit
    );
    return { user, total };
  }
}
