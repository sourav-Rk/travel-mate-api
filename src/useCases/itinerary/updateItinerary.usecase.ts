import { inject, injectable } from "tsyringe";

import { IItineraryRepository } from "../../entities/repositoryInterfaces/package/itinerary-repository.interface";
import { IPackageRepository } from "../../entities/repositoryInterfaces/package/package-repository.interface";
import { IUpdateItineraryUsecase } from "../../entities/useCaseInterfaces/itinerary/updateItinerary-usecase.interface";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { ItineraryEditDto } from "../../shared/dto/itineraryDto";
import { CustomError } from "../../shared/utils/error/customError";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ValidationError } from "../../shared/utils/error/validationError";

@injectable()
export class UpdateItineraryUsecase implements IUpdateItineraryUsecase {
  constructor(
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository,

    @inject('IPackageRepository')
    private _packageRepository : IPackageRepository
  ) {}

  async execute(
    itineraryId: string,
    data: ItineraryEditDto
  ): Promise<void> {
    if (!itineraryId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const itineraryExist = await this._itineraryRepository.findById(itineraryId);
    if (!itineraryExist) {
      throw new NotFoundError(ERROR_MESSAGE.ITINERARY_NOT_FOUND);
    }

    const packageDetails = await this._packageRepository.findByItineraryId(itineraryId);

    if(packageDetails?.status !== "draft"){
       throw new CustomError(HTTP_STATUS.CONFLICT,ERROR_MESSAGE.CANNOT_EDIT_PACKAGE+ `${packageDetails?.status}`);
    }

    await this._itineraryRepository.update(itineraryId, data);
  }
}
