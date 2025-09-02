import { ISuccessResponseHandler } from "../../../../shared/utils/successResponseHandler";

export interface IApplyPackageUsecase {
  execute(userId : string,packageId: string): Promise<ISuccessResponseHandler>;
}
