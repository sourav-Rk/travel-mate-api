import { inject, injectable } from "tsyringe";

import { IKYCRepository } from "../../entities/repositoryInterfaces/auth/kyc-repository.interface";
import {  IAddKycUsecase } from "../../entities/useCaseInterfaces/auth/add-kyc-usecase.interface";
import { HTTP_STATUS } from "../../shared/constants";
import { KycDto } from "../../shared/dto/kycDto";
import { ISuccessResponseHandler, successResponseHandler } from "../../shared/utils/successResponseHandler";

@injectable()
export class AddKycUsecase implements IAddKycUsecase{
    constructor(
        @inject('IKYCRepository')
        private kycRepository : IKYCRepository
    ){}

    async execute(data: KycDto): Promise<ISuccessResponseHandler> {
       
        await this.kycRepository.save(data);
        return successResponseHandler(true,HTTP_STATUS.CREATED,"kyc added succesfully")
    }
}