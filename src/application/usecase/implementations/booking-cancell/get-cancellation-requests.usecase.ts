import { inject, injectable } from "tsyringe";
import { IGetCancellationRequests } from "../../interfaces/booking-cancell/get-cancellation-requests-usecase.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/booking/booking-repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/package/package-repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { PaginatedCancellationRequests } from "../../../dto/response/bookingDto";

@injectable()
export class GetCancellationRequests implements IGetCancellationRequests {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(vendorId: string,page=1,limit=10,searchTerm:string,status:"cancellation_requested"|"cancelled"): Promise<PaginatedCancellationRequests> {
    if (!vendorId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const vendor = await this._vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    const packages = await this._packageRepository.findByAgencyId(vendorId);

    const packageIds = packages
      .map((pkg) => pkg.packageId)
      .filter((id): id is string => id !== undefined && id !== null);

    const { bookings, total } =
      await this._bookingRepository.findCancellationRequests(packageIds,page,limit,searchTerm,status); 

      const totalPages = Math.ceil(total / limit);
    return { bookings, total : totalPages };
  }
}
