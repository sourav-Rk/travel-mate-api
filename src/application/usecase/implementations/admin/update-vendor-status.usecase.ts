import { inject, injectable } from "tsyringe";

import { CustomError } from "../../../../domain/errors/customError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import {
  ERROR_MESSAGE,
  EVENT_EMMITER_TYPE,
  HTTP_STATUS,
  MAIL_CONTENT_PURPOSE,
  SUCCESS_MESSAGE,
} from "../../../../shared/constants";
import { eventBus } from "../../../../shared/eventBus";
import { mailContentProvider } from "../../../../shared/mailContentProvider";
import { IAdminUpdateVendorStatusUsecase } from "../../interfaces/admin/update-vendor-usecase.interface";

@injectable()
export class AdminUpateVendorStatusUsecase
  implements IAdminUpdateVendorStatusUsecase
{
  constructor(
    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}
  async execute(
    vendorId: string,
    status: string,
    reason?: string
  ): Promise<void> {
    if (!vendorId || !status)
      throw new CustomError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGE.ID_AND_STATUS_REQUIRED
      );

    if (vendorId && status) {
      const vendor = await this._vendorRepository.findById(vendorId);
      if (!vendor) throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
      await this._vendorRepository.findByIdAndUpdateStatus(
        vendorId,
        status,
        reason
      );
      if (status === "rejected" && reason) {
        const html = mailContentProvider(
          MAIL_CONTENT_PURPOSE.REQUEST_REJECTED,
          reason
        );
        eventBus.emit(
          EVENT_EMMITER_TYPE.SENDMAIL,
          vendor.email,
          SUCCESS_MESSAGE.REQUEST_REJECTED,
          html
        );
      }
    }
  }
}
