import { KycDto } from "../../../shared/dto/kycDto";
import { ISuccessResponseHandler } from "../../../shared/utils/successResponseHandler";

export interface IAddKycUsecase{
    execute(data : KycDto) : Promise<ISuccessResponseHandler>;
}