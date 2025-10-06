import { inject, injectable } from "tsyringe";

import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { IGetGuideDetailsUsecase } from "../../interfaces/vendor/get-guide-details-usecase.interface";
import { GuideMapper } from "../../../mapper/guide.mapper";
import { GuideDto } from "../../../dto/response/user.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class GetGuideDetailsUsecase implements IGetGuideDetailsUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(vendorId: any, id: any): Promise<GuideDto> {
    if (!vendorId || !id) {
      throw new ValidationError("Vendor id and guide id is required");
    }

    const vendor = await this._vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new NotFoundError("vendor not found");
    }

    const guide = await this._guideRepository.findById(id);

    if (!guide) {
      throw new NotFoundError("Guide not found");
    }

    const guideDetails = GuideMapper.mapGuideToVendorViewDto(guide);

    return guideDetails;
  }
}
