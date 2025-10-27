import { inject, injectable } from "tsyringe";

import { IClientEntity } from "../../../../domain/entities/client.entity";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import { USER_TYPES } from "../../../dto/request/admin.dto";
import { VendorProfileDto } from "../../../dto/response/vendor.dto";
import { VendorMapper } from "../../../mapper/vendor.mapper";
import { IGetUserByIdUsecase } from "../../interfaces/admin/getUserById-usecase.interface";

@injectable()
export class GetUserByIdUsecase implements IGetUserByIdUsecase {
  constructor(
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository,

    @inject("IClientRepository")
    private _clientRepository: IClientRepository
  ) {}

  async execute(
    userType: string,
    userId: string
  ): Promise<VendorProfileDto | IClientEntity> {
    if (!userId || !userType)
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.USER_TYPE_AND_ID_REQUIRED
      );
    if (userType === USER_TYPES.VENDOR) {
      const vendor = await this._vendorRepository.getVendorWithAddressAndKyc(
        userId
      );
      if (!vendor) {
        throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
      }

      const vendorDetails = VendorMapper.mapVendorToFullInfoDto(vendor);
      return vendorDetails;
    }

    if (userType === USER_TYPES.CLIENT) {
      const user = await this._clientRepository.findById(userId);
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
      }
      return user;
    }
    throw new CustomError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_MESSAGE.USER_TYPE_AND_ID_REQUIRED
    );
  }
}
