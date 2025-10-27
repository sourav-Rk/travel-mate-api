import { ISuccessResponseHandler } from "../../../../shared/utils/successResponseHandler";
import { KycDto } from "../../../dto/response/kycDto";

export interface IAddKycUsecase {
  execute(data: KycDto): Promise<ISuccessResponseHandler>;
}
