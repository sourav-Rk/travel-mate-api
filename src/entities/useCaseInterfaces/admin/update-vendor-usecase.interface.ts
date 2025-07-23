import { ISuccessResponseHandler } from "../../../shared/utils/successResponseHandler";

export interface IAdminUpdateVendorStatusUsecase {
    execute(vendorId : string,status : string, reason ?: string) : Promise<void>;
}