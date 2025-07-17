import { inject, injectable } from "tsyringe";
import { IUpdateUserstatusUsecase } from "../../entities/useCaseInterfaces/admin/update-user-status-usecase.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../shared/utils/successResponseHandler";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class UpdateUserStatusUsecase implements IUpdateUserstatusUsecase {
  constructor(
    @inject("IClientRepository")
    private clientRepository: IClientRepository,

    @inject("IVendorRepository")
    private vendorRepository: IVendorRepository
  ) {}

  async execute(
    userType: string,
    userId: any
  ): Promise<ISuccessResponseHandler> {
    if (userType === "client") {
      const user = await this.clientRepository.findById(userId);
      if (!user) {
        throw new NotFoundError("user not found");
      }
      const response = await this.clientRepository.findByIdAndUpdateStatus(
        userId
      );
      return response
        ? successResponseHandler(
            true,
            HTTP_STATUS.OK,
            "user blocked successfully"
          )
        : successResponseHandler(
            true,
            HTTP_STATUS.OK,
            "user unblocked successfully"
          );
    } else if (userType === "vendor") {
      const vendor = await this.vendorRepository.findById(userId);
      if (!vendor) {
        throw new NotFoundError("user not found");
      }
      const response = await this.vendorRepository.findByIdAndUpdateBlock(
        userId
      );
      return response
        ? successResponseHandler(
            true,
            HTTP_STATUS.OK,
            "blocked successfully"
          )
        : successResponseHandler(
            true,
            HTTP_STATUS.OK,
            "unblocked successfully"
          );
    }

    throw new NotFoundError("invalid user type");
  }
}
