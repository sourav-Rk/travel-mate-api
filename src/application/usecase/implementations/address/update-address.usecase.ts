import { inject, injectable } from "tsyringe";

import { IAddressRepository } from "../../../../domain/repositoryInterfaces/auth/address-repository.interface";
import { IUpdateAddressUsecase } from "../../interfaces/address/update-address-usecase.interface";
import { AddressDto } from "../../../dto/response/authDto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class UpdateAddressUsecase implements IUpdateAddressUsecase {
  constructor(
    @inject("IAddressRepository")
    private _addressRepository: IAddressRepository
  ) {}

  async execute(id: string, data: AddressDto): Promise<void> {
    if (!id) {
      throw new ValidationError("User id is required");
    }

    const addressExist = await this._addressRepository.findByUserId(id);

    if (!addressExist) {
      throw new NotFoundError("address not found");
    }

    await this._addressRepository.findByIdAndUpdate(id, data);
  }
}
