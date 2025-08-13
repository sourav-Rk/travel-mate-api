import { inject, injectable } from "tsyringe";

import { IClientEntity } from "../../entities/modelsEntity/client.entity";
import { IVendorEntity } from "../../entities/modelsEntity/vendor.entity";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetUserByIdUsecase } from "../../entities/useCaseInterfaces/admin/getUserById-usecase.interface";
import { HTTP_STATUS } from "../../shared/constants";
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
  ): Promise<IVendorEntity | IClientEntity> {
    if (!userId || !userType)
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        "user type and id are required"
      );
    if (userType === "vendor") {
      const vendor = await this._vendorRepository.getVendorWithAddressAndKyc(userId);
      if (!vendor) {
        throw new NotFoundError("User not found");
      }
      return vendor;
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
