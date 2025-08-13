import { inject, injectable } from "tsyringe";

import { IGuideEntity } from "../../entities/modelsEntity/guide.entity";
import { IGuideRepository } from "../../entities/repositoryInterfaces/guide/guide-repository.interface";
import { IGetGuideProfileUsecase } from "../../entities/useCaseInterfaces/guide/getGuideProfile-usecase.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ValidationError } from "../../shared/utils/error/validationError";

@injectable()
export class GetGuideProfileUsecase implements IGetGuideProfileUsecase {
  constructor(
    @inject("IGuideRepository")
    private _guideRepository: IGuideRepository
  ) {}

  async execute(id: any): Promise<IGuideEntity> {
    if (!id) {
      throw new ValidationError("guide is required");
    }

    const guide = await this._guideRepository.findById(id);

    if (!guide) {
      throw new NotFoundError("Guide not found");
    }

    return guide;
  }
}
