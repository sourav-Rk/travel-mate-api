import { inject, injectable } from "tsyringe";

import { IVendorEntity } from "../../../../domain/entities/vendor.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IPhoneExistenceService } from "../../../../domain/service-interfaces/phone-existence-service.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { IUpdateVendorProfileUsecase } from "../../interfaces/vendor/update-vendor-profile-usecase.interface";

@injectable()
export class UpdateVendorProfileUsecase implements IUpdateVendorProfileUsecase {
  constructor(
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IPhoneExistenceService")
    private _phoneExistenceService: IPhoneExistenceService
  ) {}

  async execute(id: string, data: Partial<IVendorEntity>): Promise<void> {
    if (!id) throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);

    const vendor = await this._vendorRepository.findById(id);
    if (!vendor) throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);

    if (data.phone && data?.phone !== vendor.phone) {
      const isPhoneExists = await this._phoneExistenceService.phoneExists(
        data?.phone
      );
      if (isPhoneExists)
        throw new CustomError(
          HTTP_STATUS.CONFLICT,
          ERROR_MESSAGE.PHONE_NUMBER_EXISTS
        );
    }

    await this._vendorRepository.findByIdAndUpdate(id, data);
  }
}
