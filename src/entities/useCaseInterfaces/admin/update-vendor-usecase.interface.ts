import { ISuccessResponseHandler } from "../../../shared/utils/successResponseHandler";

export interface IUpdateVendorStatusUsecase {
    execute(vendorId : string) : Promise<ISuccessResponseHandler>;
}