import { inject, injectable } from "tsyringe";

import { IKYCRepository } from "../../../../domain/repositoryInterfaces/auth/kyc-repository.interface";
import { IAddKycUsecase } from "../../interfaces/auth/add-kyc-usecase.interface";
import { HTTP_STATUS } from "../../../../shared/constants";
import { KycDto } from "../../../dto/response/kycDto";
import {
  ISuccessResponseHandler,
  successResponseHandler,
} from "../../../../shared/utils/successResponseHandler";

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
      "kyc added succesfully"
    );
  }
}
