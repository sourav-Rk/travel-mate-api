import { ISuccessResponseHandler } from "../../../shared/utils/successResponseHandler";
import { IClientEntity } from "../../modelsEntity/client.entity";
import { IVendorEntity } from "../../modelsEntity/vendor.entity";

export interface IGetUserByIdUsecase {
  execute(userType: string, userId: string): Promise<IVendorEntity | IClientEntity>;
}
