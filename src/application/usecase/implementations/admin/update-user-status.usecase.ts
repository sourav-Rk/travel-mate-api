import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../../shared/constants";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../../../shared/utils/successResponseHandler";
import { USER_TYPES } from "../../../dto/request/admin.dto";
import { IUpdateUserstatusUsecase } from "../../interfaces/admin/update-user-status-usecase.interface";

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
    userId: string
  ): Promise<ISuccessResponseHandler> {
    if (userType === USER_TYPES.CLIENT) {
      const user = await this.clientRepository.findById(userId);
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
      }
      const response = await this.clientRepository.findByIdAndUpdateStatus(
        userId
      );
      return response
        ? successResponseHandler(
            true,
            HTTP_STATUS.OK,
            ERROR_MESSAGE.USER_BLOCKED
          )
        : successResponseHandler(
            true,
            HTTP_STATUS.OK,
            ERROR_MESSAGE.USER_UNBLOCKED
          );
    } else if (userType === USER_TYPES.VENDOR) {
      const vendor = await this.vendorRepository.findById(userId);
      if (!vendor) {
        throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
      }
      const response = await this.vendorRepository.findByIdAndUpdateBlock(
        userId
      );
      return response
        ? successResponseHandler(true, HTTP_STATUS.OK,ERROR_MESSAGE.USER_BLOCKED)
        : successResponseHandler(
            true,
            HTTP_STATUS.OK,
            ERROR_MESSAGE.USER_UNBLOCKED
          );
    }

    throw new NotFoundError(ERROR_MESSAGE.INVALID_USER_TYPE);
  }
}
