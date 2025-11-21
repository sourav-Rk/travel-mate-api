import { inject, injectable } from "tsyringe";

import { ValidationError } from "../../../../domain/errors/validationError";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import {
  ERROR_MESSAGE,
  LocalGuideBookingListFilters,
  LocalGuideBookingListResult,
} from "../../../../shared/constants";
import { LocalGuideBookingMapper } from "../../../mapper/localGuideBooking.mapper";
import { IGetLocalGuideBookingsUsecase } from "../../interfaces/local-guide-booking/get-bookings.interface";

@injectable()
export class GetLocalGuideBookingsUsecase
  implements IGetLocalGuideBookingsUsecase
{
  constructor(
    @inject("ILocalGuideBookingRepository")
    private readonly _localGuideBookingRepository: ILocalGuideBookingRepository,
    @inject("IClientRepository")
    private readonly _clientRepository: IClientRepository
  ) {}

  async execute(
    travellerId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<LocalGuideBookingListResult> {
    if (!travellerId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const { bookings, pagination, summary } =
      await this._localGuideBookingRepository.findWithFilters(
        travellerId,
        filters
      );

    return {
      bookings: bookings.map(LocalGuideBookingMapper.toDto),
      pagination,
      summary,
    };
  }
}
