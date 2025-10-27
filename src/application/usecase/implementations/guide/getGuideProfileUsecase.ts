import { inject, injectable } from "tsyringe";

import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { GuideProfileDto } from "../../../dto/response/guideDto";
import { GuideMapper } from "../../../mapper/guide.mapper";
import { IGetGuideProfileUsecase } from "../../interfaces/guide/getGuideProfile-usecase.interface";

@injectable()
export class GetGuideProfileUsecase implements IGetGuideProfileUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async execute(id: string): Promise<GuideProfileDto> {
    if (!id) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const guide = await this._guideRepository.findById(id);

    if (!guide) {
      throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    const guideProfiledata = GuideMapper.mapToGuideProfile(guide);

    return guideProfiledata;
  }
}
