import { inject, injectable } from "tsyringe";
import { IAssignedTripsUsecase } from "../../interfaces/guideTrips/assignedTrips-usecase.interface";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { PackageMapper } from "../../../mapper/package.mapper";
import { PaginatedPackages } from "../../../../domain/entities/paginated-packages.entity";

@injectable()
export class AssignedTripsUsecase implements IAssignedTripsUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository
  ) {}

  async execute(
    guideId: string,
    searchTerm: string,
    status: string,
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedPackages> {
    if (!guideId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const guide = await this._guideRepository.findById(guideId);

    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    const assignedTripIds = guide.assignedTrips || [];

    if (assignedTripIds.length === 0) {
      return { packages: [], total: 0 };
    }

    const validPageNumber = Math.max(1, pageNumber || 0);
    const validPageSize = Math.max(1, pageSize || 10);
    const { packages, total } =
      await this._packageRepository.findAssignedPackages(
        assignedTripIds,
        searchTerm,
        status,
        validPageNumber,
        validPageSize
      );
    const validPackages = packages.filter(
      (pkg): pkg is NonNullable<typeof pkg> => pkg !== null
    );

    let totalPages = Math.ceil(total / validPageSize);

    return {
      packages: validPackages.map((pkg) =>
        PackageMapper.mapPackageToGuideTableDto(pkg)
      ),
      total: totalPages,
    };
  }
}
