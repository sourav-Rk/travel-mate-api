import { inject, injectable } from "tsyringe";
import { IUpdateAddressUsecase } from "../../entities/useCaseInterfaces/address/update-address-usecase.interface";
import { IAddressRepository } from "../../entities/repositoryInterfaces/auth/address-repository.interface";
import { IAddressEntity } from "../../entities/modelsEntity/address.entity";
import { ValidationError } from "../../shared/utils/error/validationError";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { AddressDto } from "../../shared/dto/authDto";

@injectable()
export class UpdateAddressUsecase implements IUpdateAddressUsecase {
    constructor(
        @inject('IAddressRepository')
        private _addressRepository : IAddressRepository
    ){}

    async execute(id: string, data: AddressDto): Promise<void> {
        if(!id){
            throw new ValidationError("User id is required");
        }

        const addressExist = await this._addressRepository.findByUserId(id);

        if(!addressExist){
            throw new NotFoundError("address not found");
        }

        await this._addressRepository.findByIdAndUpdate(id,data);

    }
}