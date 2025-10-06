import { KycDto } from "../../../dto/response/kycDto";
import { ISuccessResponseHandler } from "../../../../shared/utils/successResponseHandler";

export interface IAddKycUsecase {
  execute(data: KycDto): Promise<ISuccessResponseHandler>;
}
