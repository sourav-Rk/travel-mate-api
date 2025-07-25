import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../entities/repositoryInterfaces/vendor/vendor-repository.interface";
import { CustomError } from "../../shared/utils/error/customError";
import { EVENT_EMMITER_TYPE, HTTP_STATUS, MAIL_CONTENT_PURPOSE, STATUS } from "../../shared/constants";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { eventBus } from "../../shared/eventBus";
import { mailContentProvider } from "../../shared/mailContentProvider";
import { IAdminUpdateVendorStatusUsecase } from "../../entities/useCaseInterfaces/admin/update-vendor-usecase.interface";


@injectable()
export class AdminUpateVendorStatusUsecase implements IAdminUpdateVendorStatusUsecase{
    constructor(
      @inject('IVendorRepository')
      private _vendorRepository : IVendorRepository,
    ){}
    async execute(vendorId: string, status: string,reason ?: string): Promise<void> {
        console.log("status check", status === "rejected", !!reason);

        console.log("triggereddd")
        console.log(vendorId,"-->vendor id")
        console.log(status,"-->vendor sttatus")
        console.log(reason,"-->vendor reason")
        if(!vendorId || !status) throw new CustomError(HTTP_STATUS.BAD_REQUEST,"vendor id and status are required");

        if(vendorId && status){
            const vendor = await this._vendorRepository.findById(vendorId);
            if(!vendor) throw new NotFoundError("user not found");
            await this._vendorRepository.findByIdAndUpdateStatus(vendorId,status,reason);
            if(status === "rejected" && reason){
                console.log("triggerd email")
                const html = mailContentProvider(MAIL_CONTENT_PURPOSE.REQUEST_REJECTED,reason)
                console.log("Generated HTML", html);

                eventBus.emit(EVENT_EMMITER_TYPE.SENDMAIL,vendor.email,"Request Rejected",html)
            }
        }
    }
}