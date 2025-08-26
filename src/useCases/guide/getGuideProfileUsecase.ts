import { inject, injectable } from "tsyringe";

import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IGetGuideProfileUsecase } from "../../entities/useCaseInterfaces/guide/getGuideProfile-usecase.interface";
import { GuideMapper } from "../../interfaceAdapters/mappers/guide.mapper";
import { GuideProfileDto } from "../../shared/dto/guideDto";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ValidationError } from "../../shared/utils/error/validationError";

@injectable()
export class GetGuideProfileUsecase implements IGetGuideProfileUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async execute(id: any): Promise<GuideProfileDto> {
    if (!id) {
      throw new ValidationError("guide is required");
    }

    const guide = await this._guideRepository.findById(id);

    if (!guide) {
      throw new NotFoundError("Guide not found");
    }

    const guideProfiledata = GuideMapper.mapToGuideProfile(guide);

    return guideProfiledata;
  }
}
