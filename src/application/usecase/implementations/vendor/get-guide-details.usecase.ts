import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IVendorRepository } from "../../../../domain/repositoryInterfaces/vendor/vendor-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { GuideDto } from "../../../dto/response/user.dto";
import { GuideMapper } from "../../../mapper/guide.mapper";
import { IGetGuideDetailsUsecase } from "../../interfaces/vendor/get-guide-details-usecase.interface";

@injectable()
export class GetGuideDetailsUsecase implements IGetGuideDetailsUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository,

    @inject("IVendorRepository")
    private _vendorRepository: IVendorRepository
  ) {}

  async execute(vendorId: string, id: string): Promise<GuideDto> {
    if (!vendorId || !id) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const vendor = await this._vendorRepository.findById(vendorId);

    if (!vendor) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY_NOT_FOUND);
    }

    const guide = await this._guideRepository.findById(id);

    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    const guideDetails = GuideMapper.mapGuideToVendorViewDto(guide);

    return guideDetails;
  }
}
