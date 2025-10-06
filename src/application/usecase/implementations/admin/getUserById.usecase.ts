import { inject, injectable } from "tsyringe";

import { IClientEntity } from "../../../../domain/entities/client.entity";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetUserByIdUsecase } from "../../interfaces/admin/getUserById-usecase.interface";
import { VendorMapper } from "../../../mapper/vendor.mapper";
import { HTTP_STATUS } from "../../../../shared/constants";
import { VendorProfileDto } from "../../../dto/response/vendor.dto";
import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

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
