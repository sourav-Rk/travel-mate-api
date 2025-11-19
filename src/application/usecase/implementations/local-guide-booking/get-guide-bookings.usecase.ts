import { inject, injectable } from "tsyringe";

import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import {
  IGetLocalGuideBookingsForGuideUsecase,
  LocalGuideBookingListFilters,
  LocalGuideBookingListResult,
} from "../../interfaces/local-guide-booking/get-guide-bookings.interface";
import { LocalGuideBookingMapper } from "../../../mapper/localGuideBooking.mapper";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";

@injectable()
export class GetLocalGuideBookingsForGuideUsecase
  implements IGetLocalGuideBookingsForGuideUsecase
{
  constructor(
    @inject("ILocalGuideBookingRepository")
    private readonly _localGuideBookingRepository: ILocalGuideBookingRepository
  ) {}

  async execute(
    guideId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<LocalGuideBookingListResult> {
    if (!guideId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const { bookings, pagination, summary } =
      await this._localGuideBookingRepository.findGuideBookingsWithFilters(
        guideId,
        filters
      );

    return {
      bookings: bookings.map(LocalGuideBookingMapper.toDto),
      pagination,
      summary,
    };
  }
}


