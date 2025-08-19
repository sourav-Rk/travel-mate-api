import { inject, injectable } from "tsyringe";
import { IUpdateItineraryUsecase } from "../../entities/useCaseInterfaces/itinerary/updateItinerary-usecase.interface";
import { IItineraryRepository } from "../../entities/repositoryInterfaces/package/itinerary-repository.interface";
import { NotFoundError } from "../../shared/utils/error/notFoundError";
import { ERROR_MESSAGE } from "../../shared/constants";
import { ValidationError } from "../../shared/utils/error/validationError";
import { ItineraryEditDto } from "../../shared/dto/itineraryDto";

@injectable()
export class UpdateItineraryUsecase implements IUpdateItineraryUsecase {
  constructor(
    @inject("IItineraryRepository")
    private _itineraryRepository: IItineraryRepository
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

    await this._itineraryRepository.update(itineraryId, data);
  }
}
