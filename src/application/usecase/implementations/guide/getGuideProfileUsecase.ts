import { inject, injectable } from "tsyringe";

import { IGuideRepository } from "../../../../domain/repositoryInterfaces/guide/guide-repository.interface";
import { IGetGuideProfileUsecase } from "../../interfaces/guide/getGuideProfile-usecase.interface";
import { GuideMapper } from "../../../mapper/guide.mapper";
import { GuideProfileDto } from "../../../dto/response/guideDto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";

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
