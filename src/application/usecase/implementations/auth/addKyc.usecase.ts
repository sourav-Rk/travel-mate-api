import { inject, injectable } from "tsyringe";

import { IKYCRepository } from "../../../../domain/repositoryInterfaces/auth/kyc-repository.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../../shared/constants";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../../../shared/utils/successResponseHandler";
import { KycDto } from "../../../dto/response/kycDto";
import { IAddKycUsecase } from "../../interfaces/auth/add-kyc-usecase.interface";

@injectable()
export class AddKycUsecase implements IAddKycUsecase {
  constructor(
    @inject("IKYCRepository")
    private kycRepository: IKYCRepository
  ) {}

  async execute(data: KycDto): Promise<ISuccessResponseHandler> {
    await this.kycRepository.save(data);
    return successResponseHandler(
      true,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.KYC.ADDED_SUCCESSFULLY
    );
  }
}
