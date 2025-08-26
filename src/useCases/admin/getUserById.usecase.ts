import { inject, injectable } from "tsyringe";

import { IClientEntity } from "../../entities/modelsEntity/client.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetUserByIdUsecase } from "../../entities/useCaseInterfaces/admin/getUserById-usecase.interface";
import { VendorMapper } from "../../interfaceAdapters/mappers/vendor.mapper";
import { HTTP_STATUS } from "../../shared/constants";
import { VendorProfileDto } from "../../shared/dto/vendor.dto";
import { CustomError } from "../../shared/utils/error/customError";
import { NotFoundError } from "../../shared/utils/error/notFoundError";

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
        "user type and id are required"
      );
    if (userType === "vendor") {
      const vendor = await this._vendorRepository.getVendorWithAddressAndKyc(
        userId
      );
      if (!vendor) {
        throw new NotFoundError("User not found");
      }

      const vendorDetails = VendorMapper.mapVendorToFullInfoDto(vendor);
      return vendorDetails;
    }

    if (userType === "client") {
      const user = await this._clientRepository.findById(userId);
      if (!user) {
        throw new NotFoundError("user not found");
      }
      return user;
    }
    throw new CustomError(
      HTTP_STATUS.BAD_REQUEST,
      "invalid user type . Must be either client or vendor"
    );
  }
}
